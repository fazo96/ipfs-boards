var React = require('react')
var ReactDOM = require('react-dom')
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
      <h3>Hello</h3>
    )
  }
})

var Navbar = React.createClass({
  render: function(){
    return (
      <div className="navbar">
        <div className="container">
          <h4>Boards</h4>
        </div>
      </div>)
  }
})

var Profile = React.createClass({
  getInitialState: function(){
    return { name: '...' }
  },
  componentDidMount: function(){
    boards.getProfile(this.props.id, (err,res) => {
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
      <h5 className="light">@{this.props.id}</h5>
    </div>)
  }
})

ReactDOM.render(
  <App><Profile id="QmXnfA41SXMX3tqFD4kjED7ehyvgTsuAho86TkEoTbZdpw"/></App>, document.getElementById('root')
)
