var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Link = require('react-router').Link

var ipfs = require('ipfs-api')('localhost',5001)
var BoardsAPI = require('../lib/boards-api.js')

var boards = new BoardsAPI(ipfs)

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
        <h3>Hello</h3>
        <p>Not much is implemented...</p>
        <p>You can try <Link to="@QmXnfA41SXMX3tqFD4kjED7ehyvgTsuAho86TkEoTbZdpw">Opening a Profile</Link> though :)</p>
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
    return { name: '...' }
  },
  componentDidMount: function(){
    boards.getProfile(this.props.params.userid, (err,res) => {
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
  },
  render: function(){
    return (<div className="profile">
      <h1>{this.state.name}</h1>
      <p>{this.state.error}</p>
      <h5 className="light">@{this.props.params.userid}</h5>
    </div>)
  }
})

var Board = React.createClass({
  getInitialState: function(){
    return { posts: [] }
  },
  render: function(){
    return (
      <div></div>
    )
  }
})

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Homepage} />
      <Route path="/@:userid" component={Profile} />
    </Route>
  </Router>, document.getElementById('root')
)
