var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Redirect = require('react-router').Redirect
var Link = require('react-router').Link

var MarkdownLib = require('react-markdown')
var BoardsAPI = require('../lib/boards-api.js')

var opt, s = localStorage.getItem('ipfs-boards-settings')
try {
  opt = JSON.parse(s)
} catch(e){
  // Do nothing
}
if(opt === null || opt === undefined) opt = { addr: 'localhost', port: 5001 }
var ipfs = require('ipfs-api')(opt.addr || 'localhost',opt.port || 5001)
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
              {this.props.children || <h4><Link to="/"><Icon name="comments" class="light"/> Boards</Link></h4>}
              <div className="u-pull-right iconbar">
                <Link className="nounderline" to="/@me"><Icon name="user" class="fa-2x light"/></Link>
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
    return { }
  },
  componentDidMount: function(){
    boards.getProfile(this.props.id, (err,res) => {
      if(!this.isMounted()) return true
      if(!err) {
        this.setState({ name: res.name.trim() })
      }
    })
  },
  getContent: function(){
    if(this.state.name){
      return (<Icon name="user" />)
    } else {
      return '@'
    }
  },
  render: function(){
    return (<div className="board">
      <Link className="light nounderline" to={'/@'+this.props.id}>
        {this.getContent()}{this.state.name || this.props.id}
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
      <div className="">
        <h1><Icon name="ban"/> Missing IPFS Node</h1>
        <p>You don't have an IPFS node running at <code>{opt.addr}:{opt.port}</code> or it is not reachable</p>
        <p>The IPFS Boards prototype requires a full IPFS node running at localhost.
        Please start one by following the
        <a href="https://github.com/ipfs/go-ipfs"><code>go-ipfs</code> documentation.</a></p>
        <h5>Do you have a running node but the app won't work?</h5>
        <p>It's probably one of these issues:</p>
        <ul>
          <li>Your IPFS node doesn't allow requests from the domain you're running the app from (CORS issue). See <a href="https://github.com/fazo96/ipfs-board/blob/master/ipfs_daemon_set_cors.sh">here</a> for the fix.</li>
          <li>Your IPFS node is not listening for API requests at <code>{opt.addr}:{opt.port}</code>. Go to the <Link to="/settings">Settings page</Link>, provide the correct address for the node, then save and reload the page.</li>
        <li>Some other networking issue is preventing the App from talking to your node.</li>
        </ul>
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
    console.log('About to ask for profile for',this.props.params.userid)
    var ee = boards.getEventEmitter()
    ee.on('boards for '+this.props.params.userid,l => {
      if(!this.isMounted()) return true
      this.setState({ boards: l })
    })
    boards.getProfile(this.props.params.userid,(err,res) => {
      if(!this.isMounted()) return true
      if(err){
        this.setState({
          name: <Icon name="ban" />,
          description: err
        })
      } else {
        this.setState({ name: res.name, description: res.description })
      }
    })
  },
  linkToEditor: function(){
    if(this.props.params.userid === boards.id){
      return <div>
        <h6>This is your profile</h6>
        <hr/>
      </div>
    }
    return ''
  },
  render: function(){
    return (<div className="profile">
      {this.linkToEditor()}
      <h1>{this.state.name}</h1>
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
  getInitialState: function(){
    return { users: [ boards.id ] }
  },
  componentDidMount: function(){
    boards.searchUsers().on('user',(id) => {
      if(this.isMounted() && this.state.users.indexOf(id) < 0)
        this.setState({ users: this.state.users.concat(id) })
    })
  },
  render: function(){
    return <div>
      <h1><Icon name="users" /> Users</h1>
      <p>Found <b>{this.state.users.length}</b> users, looking for more...</p>
      <ul>
        {this.state.users.map(user => {
          return <UserID key={user} id={user} />
        })}
      </ul>
    </div>
  }
})

var Settings = React.createClass({
  getDefaults: function(){
    return { addr: 'localhost', port: 5001 }
  },
  getInitialState: function(){
    var s = localStorage.getItem('ipfs-boards-settings')
    var obj = this.getDefaults()
    try {
      obj = JSON.parse(s)
    } catch(e){
      localStorage.removeItem('ipfs-boards-settings')
    }
    return obj || this.getDefaults()
  },
  save: function(){
    if(isNaN(this.state.port) || parseInt(this.state.port) > 65535 || parseInt(this.state.port) < 1){
      alert('Port number invalid')
    } else {
      localStorage.setItem('ipfs-boards-settings',JSON.stringify({
        addr: this.state.addr,
        port: parseInt(this.state.port)
      }))
      alert('Saved')
    }
  },
  setDefaults: function(){
    this.setState(this.getDefaults())
  },
  onChange: function(event){
    if(event.target.id === 'nodeAddress'){
      this.setState({ addr: event.target.value })
    } else {
      this.setState({ port: event.target.value })
    }
  },
  render: function(){
    return (
      <div className="settings">
        <h2><Icon name="cog"/> Settings</h2>
        <h5>This page is still a little rough, but it works. Reload the page after saving to apply changes.</h5>
        <p>Use this page to customize the application's behavior. For now, you can change how it connects to IPFS.</p>
        <p>All settings are saved in your browser.</p>
        <div className="row">
          <div className="six columns">
            <label for="nodeAddress">IPFS Node</label>
            <input className="u-full-width" type="text" id="nodeAddress" value={this.state.addr} onChange={this.onChange} placeholder="localhost" />
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
    ReactDOM.render(
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={GetIPFS} />
          <Route path="/settings" component={Settings} />
        </Route>
      </Router>
    , document.getElementById('root'))
  } else {
    ReactDOM.render(
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={Homepage} />
          <Redirect from="/@me" to={'/@'+boards.id} />
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
