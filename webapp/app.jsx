var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Link = require('react-router').Link

var MarkdownLib = require('react-markdown')
var ipfs = require('ipfs-api')('localhost',5001)
var BoardsAPI = require('../lib/boards-api.js')

var boards = new BoardsAPI(ipfs)

// Components

var Markdown = React.createClass({
  renderIfApplicable: function(){
    if(this.props.source)
      return <MarkdownLib source={this.props.source} skipHtml={true} />
    return <p>...</p>
  },
  render: function(){
    return this.renderIfApplicable()
  }
})

var Icon = React.createClass({
  class: function(){
    return 'fa fa-'+this.props.name+' '+this.props.class
  },
  render: function(){
    return ( <i className={this.class()}></i> )
  }
})

var Container = React.createClass({
  render: function(){
    return ( <div className="container app">{this.props.children}</div> )
  }
})

var App = React.createClass({
  render: function(){
    return ( <div><Navbar /><Container>{this.props.children}</Container></div> )
  }
})

var Navbar = React.createClass({
  render: function(){
    return (
      <div className="navbar">
        <div className="container">
          <div className="row">
            <div className="twelve columns">
              <h4><Link to="/"><Icon name="comments" class="light"/> Boards</Link></h4>
              <div className="u-pull-right iconbar">
                <Link className="nounderline" to="/users"><Icon name="globe" class="fa-2x light"/></Link>
                <Link className="nounderline" to="/settings"><Icon name="cog" class="fa-2x light"/></Link>
                <a className="nounderline" href="https://github.com/fazo96/ipfs-boards"><Icon name="github" class="fa-2x light"/></a>
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
})

var PostList = React.createClass({
  getInitialState: function(){
    return { posts: [] }
  },
  componentDidMount: function(){
    console.log('Initial POSTS',this.state.posts.length)
    boards.getPostsInBoard(this.props.admin,this.props.board)
    .on('post in '+this.props.board+'@'+this.props.admin,(post,hash) => {
      if(!this.isMounted()) return true
      this.setState({ posts: this.state.posts.concat(post) })
    })
  },
  render: function(){
    return (
      <div className="postList">
        {this.state.posts.map(post => {
          return (<div key={post.title} className="post">
            <h5>{post.title}</h5>
            <Markdown source={post.text} skipHtml={true} />
          </div>)
        })}
      </div>
    )
  }
})

var UserID = React.createClass({
  getInitialState: function(){
    return { name: '@'+this.props.id }
  },
  componentDidMount: function(){
    boards.getProfile(this.props.id, (err,res) => {
      if(!this.isMounted()) return true
      if(!err) {
        this.setState({ name: res.name.trim() })
      }
    })
  },
  render: function(){
    return (<div className="board">
      <Link className="light nounderline" to={'/@'+this.props.id}>
        <Icon name="user"/> {this.state.name}
      </Link>
    </div>)
  }
})

// Static pages

var Homepage = React.createClass({
  render: function(){
    return (
      <div>
        <h3>Welcome to the IPFS Boards Prototype</h3>
        <p>Not much is implemented...</p>
        <p>You can try <Link to="@QmXnfA41SXMX3tqFD4kjED7ehyvgTsuAho86TkEoTbZdpw">Opening my Profile</Link> though :)</p>
        <p>More information about the project on <a href="https://github.com/fazo96/ipfs-board">GitHub</a></p>
      </div>
    )
  }
})

var GetIPFS = React.createClass({
  render: function(){
    return (
      <div className="text-center">
        <h1>Missing IPFS Node</h1>
        <p>You don't have an IPFS node running at <code>localhost:5001</code>
        or it is not reachable</p>
        <p>The IPFS Boards prototype requires a full IPFS node running at localhost.
        Please start one by following the
        <a href="https://github.com/ipfs/go-ipfs"><code>go-ipfs</code> documentation.</a></p>
        <p>If you have a running node but still this doesn't work, it's probably a CORS issue</p>
        <p>You can find out how to fix CORS issues related to this app <a href="https://github.com/fazo96/ipfs-board/blob/master/ipfs_daemon_set_cors.sh">here</a>.</p>
        <p>Still can't fix it? <a href="https://github.com/fazo96/ipfs-board/issues">File a issue on GitHub</a>, we'll be happy to help!</p>
      </div>
    )
  }
})

var NotFound = React.createClass({
  render: function(){
    return (<div className="text-center">
      <h1><Icon name="ban"/></h1>
      <p>Sorry, there's nothing here!</p>
    </div>)
  }
})

var NotImplemented = React.createClass({
  render: function(){
    return ( <div className="text-center">
      <h1>Not yet implemented</h1>
      <h1><Icon name="cog" class="fa-spin"/></h1>
      <p>Sorry, working on it!</p>
    </div> )
  }
})

// Dynamic pages

var Profile = React.createClass({
  getInitialState: function(){
    return { name: '...', boards: [] }
  },
  componentDidMount: function(){
    var ee = boards.getProfile(this.props.params.userid, (err,res) => {
      if(!this.isMounted()) return true
      if(err){
        console.log(err)
        this.setState({
          name: '?',
          error: 'Invalid profile'
        })
      } else {
        console.log(res)
        this.setState({ name: res.name, description: res.description })
      }
    })
    ee.on('boards for '+this.props.params.userid,l => {
      if(!this.isMounted()) return true
      this.setState({ boards: l })
    })
  },
  render: function(){
    return (<div className="profile">
      <h1>{this.state.name}</h1>
      <p>{this.state.error}</p>
      <Markdown source={this.state.description} skipHtml={true} />
      <hr/>
      <h5 className="light">@{this.props.params.userid}</h5>
      {this.state.boards.map(n => {
        return <h6 className="light" key={this.props.params.userid+'/'+n.name}>
          <Link to={'/@'+this.props.params.userid+'/'+n.name}># {n.name}</Link>
        </h6>
      })}
    </div>)
  }
})

var Board = React.createClass({
  getInitialState: function(){
    return { name: this.props.params.boardname }
  },
  componentDidMount: function(){
    var ee = boards.getBoardSettings(this.props.params.userid,this.props.params.boardname)
    ee.on('settings for '+this.props.params.boardname+'@'+this.props.params.userid, (res) => {
      if(!this.isMounted()) return true
      console.log('Found name:',res.fullname)
      this.setState({ name: res.fullname.trim(), description: res.description })
    })
  },
  render: function(){
    return (<div className="board">
      <h2>{this.state.name}</h2>
      <Markdown source={this.state.description} skipHtml={true} />
      <h5><UserID id={this.props.params.userid} /></h5>
      <PostList board={this.props.params.boardname} admin={this.props.params.userid}/>
    </div>)
  }
})

var Users = React.createClass({
  render: function(){
    return <NotImplemented />
  }
})

var Settings = React.createClass({
  getInitialState: function(){
    // get from localstorage
    return { addr: 'localhost', port: '5001' }
  },
  save: function(){
    // write to localstorage

  },
  setDefaults: function(){
    this.setState({ addr: 'localhost', port: '5001' })
  },
  onChange: function(event){
    console.log(event.target.id)
    //this.setState({})
  },
  render: function(){
    return (
      <div className="settings">
        <h2><Icon name="cog"/> Settings</h2>
        <h4>Note that this page doesn't work yet.</h4>
        <p>Use this page to customize the application's behavior. For now, you can change how it connects to IPFS.</p>
        <p>All settings are saved in your browser.</p>
        <div className="row">
          <div className="six columns">
            <label for="nodeAddress">IPFS Node</label>
            <input className="u-full-width" type="text" id="nodeAddess" value={this.state.addr} onChange={this.onChange} placeholder="localhost" />
          </div>
          <div className="six columns">
            <label for="nodePort">API Port</label>
            <input className="u-full-width" type="text" id="nodePort" value={this.state.port} onChange={this.onChange} placeholder="5001" />
          </div>
        </div>
        <div className="buttons">
          <button className="button button-primary" onClick={this.save}>Save</button>
          <button className="button not-first" onClick={this.setDefaults}>Defaults</button>
        </div>
      </div>
    )
  }
})

// Start

boards.init(err => {
  if(err){
    console.log('FATAL: IPFS NODE NOT AVAILABLE')
    ReactDOM.render(<App><GetIPFS/></App>, document.getElementById('root'))
  } else {
    ReactDOM.render(
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={Homepage} />
          <Route path="/@:userid">
            <IndexRoute component={Profile} />
            <Route path=":boardname" component={Board} />
          </Route>
          <Route path="/users" component={Users} />
          <Route path="/settings" component={Settings} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>, document.getElementById('root')
    )
  }
})
