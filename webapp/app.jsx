var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute
var Redirect = require('react-router').Redirect
var Link = require('react-router').Link
var BoardsAPI = require('boards-api.js')

// Load CSS
require('normalize.css')
require('skeleton.css')
require('style.css')
require('raleway.css')
require('font-awesome.min.css')

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
          {this.props.children || <h4><Link to="/"><Icon name="comments" className="light"/> Boards</Link></h4>}
          <div className="u-pull-right iconbar">
            <Link className="nounderline" to="/@me"><Icon name="user" className="fa-2x light"/></Link>
            <Link className="nounderline" to="/users"><Icon name="globe" className="fa-2x light"/></Link>
            <Link className="nounderline" to="/settings"><Icon name="cog" className="fa-2x light"/></Link>
            <a className="nounderline" href="https://github.com/fazo96/ipfs-boards"><Icon name="github" className="fa-2x light"/></a>
          </div>
        </div>
      </div>)
  }
})

// Static pages

var Static = React.createClass({
  html: function(){
    return { __html: this.props.content }
  },
  render: function(){
    if(this.props.content){
      return <div className={this.props.className} dangerouslySetInnerHTML={this.html()} />
    } else {
      return <NotFound />
    }
  }
})

/*var Homepage = React.createClass({
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
})*/

var Homepage = React.createClass({
  render: function(){
    return <Static className="homepage" content={require('landing.md')} />
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
      <h1><Icon name="cog" className="fa-spin"/></h1>
      <p>Sorry, working on it!</p>
    </div> )
  }
})

// Start

var Users = require('users.jsx')(boards)
var Settings = require('settings.jsx')(boards)
var Profile = require('profile.jsx')(boards)
var Board = require('board.jsx')(boards)
var Icon = require('icon.jsx')

boards.init(err => {
  if(err){
    console.log('FATAL: IPFS NODE NOT AVAILABLE')
    ReactDOM.render(
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={Homepage} />
          <Route path="/settings" component={Settings} />
          <Route path="*" component={GetIPFS} />
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
