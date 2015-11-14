var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Link = require('react-router').Link

var ipfs = require('ipfs-api')('localhost',5001)
var BoardsAPI = require('../lib/boards-api.js')

var boards = new BoardsAPI(ipfs)
boards.init(_ => {
  console.log('Boards init complete')
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

var Navbar = React.createClass({
  render: function(){
    return (
      <div className="navbar">
        <div className="container">
          <h4><Link to="/">Boards</Link></h4>
        </div>
      </div>)
  }
})

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
        this.setState({ name: res.name })
      }
    })
    ee.on('boards',l => {
      if(!this.isMounted()) return true
      this.setState({ boards: l })
    })
  },
  render: function(){
    return (<div className="profile">
      <h1>{this.state.name}</h1>
      <p>{this.state.error}</p>
      <h5 className="light">@{this.props.params.userid}</h5>
      <ul>
        {this.state.boards.map(n => {
          return <li key={this.props.params.userid+'/'+n.name}>
            <Link to={'/@'+this.props.params.userid+'/'+n.name}>{n.name}</Link>
          </li>
        })}
      </ul>
    </div>)
  }
})

var PostList = React.createClass({
  getInitialState: function(){
    return { posts: [] }
  },
  componentDidMount: function(){
    console.log('Initial POSTS',this.state.posts.length)
    boards.getPostsInBoard(this.props.admin,this.props.board).on('post',(post,hash) => {
      if(!this.isMounted()) return true
      var posts = this.state.posts
      posts.push(post)
      this.setState({ posts })
    })
  },
  render: function(){
    return (
      <div className="postList">
        {this.state.posts.map(post => {
          return (<div key={post.title} className="post">
            <h5>{post.title}</h5>
            <p>{post.text}</p>
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
        this.setState({ name: '@'+res.name.trim() })
      }
    })
  },
  render: function(){
    return (<div className="board">
      <Link to={'/@'+this.props.id}>
        <h5 className="light">{this.state.name}</h5>
      </Link>
    </div>)
  }
})

var Board = React.createClass({
  getInitialState: function(){
    return { name: '# '+this.props.params.boardname }
  },
  componentDidMount: function(){
    boards.getBoardSettings(this.props.params.userid,this.props.params.boardname, (err,res) => {
      if(!this.isMounted()) return true
      if(err) {
        console.log('Huh? Invalid board settings?',err)
      } else {
        console.log('Found name:',res.fullname)
        this.setState({ name: '# '+res.fullname.trim() })
      }
    })
  },
  render: function(){
    return (<div className="board">
      <h2>{this.state.name}</h2>
      <UserID id={this.props.params.userid} />
      <PostList board={this.props.params.boardname} admin={this.props.params.userid}/>
    </div>)
  }
})

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Homepage} />
      <Route path="/@:userid">
        <IndexRoute component={Profile} />
        <Route path=":boardname" component={Board}/>
      </Route>
    </Route>
  </Router>, document.getElementById('root')
)
