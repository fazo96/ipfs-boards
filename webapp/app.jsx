var React = require('react')
var ReactDOM = require('react-dom')
var Router = require('react-router').Router
var Route = require('react-router').Route
var IndexRoute = require('react-router').IndexRoute

// Load CSS
require('normalize.css')
require('skeleton.css')
require('style.css')
require('raleway.css')

// Load Components

var BoardsWrapper = require('boardsapiwrapper.js')
var boards = new BoardsWrapper()
var Icon = require('icon.jsx')

// Load pages

var Navbar = require('navbar.jsx')(boards)
var Users = require('users.jsx')(boards)
var Settings = require('settings.jsx')(boards)
var Profile = require('profile.jsx')(boards)
var Board = require('board.jsx')(boards)
var PostPage = require('postpage.jsx')(boards)
var CommentPage = require('commentpage.jsx')(boards)

// Define Main Components

var Container = React.createClass({
  render () {
    return (<div className="container app">{this.props.children}</div>)
  }
})

var App = React.createClass({
  render () {
    return (<div><Navbar /><Container>{this.props.children}</Container></div>)
  }
})

// Static pages

var Static = React.createClass({
  html () {
    return { __html: this.props.content }
  },
  render () {
    if (this.props.content) {
      return <div className={this.props.className} dangerouslySetInnerHTML={this.html()} />
    } else {
      return <NotFound />
    }
  }
})

var Homepage = React.createClass({
  render () {
    return <Static className="homepage" content={require('landing.md')} />
  }
})

var NotFound = React.createClass({
  render () {
    return (<div className="text-center">
      <h1><Icon name="ban"/></h1>
      <p>Sorry, there's nothing here!</p>
    </div>)
  }
})

// Start

ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Homepage} />
      <Route path="/@:userid">
        <IndexRoute component={Profile} />
        <Route path="post/:posthash" >
          <IndexRoute component={PostPage} />
        </Route>
        <Route path=":boardname">
          <IndexRoute component={Board} />
          <Route path=":posthash">
            <IndexRoute component={PostPage} />
            <Route path=":commenthash" component={CommentPage} />
          </Route>
        </Route>
      </Route>
      <Route path="/post/:posthash" component={PostPage} />
      <Route path="/board/:boardname" component={Board} />
      <Route path="/users" component={Users} />
      <Route path="/settings" component={Settings} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>, document.getElementById('root')
)
