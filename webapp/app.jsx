// Load CSS

require('normalize.css')
require('skeleton.css')
require('raleway.css')

// Start

document.getElementById('root').innerHTML = `
  <div style="text-align:center;margin-top:2rem">
    <h1>Loading</h1>
    <p>Gathering components</p>
  </div>
`

require.ensure('react', _ => {
  var React = require('react')
  // Load CSS
  require('style.css')
  require('font-awesome.min.css')
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
  var ProfileEditor = require('profile-editor.jsx')(boards)
  var BoardEditor = require('board-editor.jsx')(boards)
  var PostEditor = require('post-editor.jsx')(boards)
  var Status = require('status.jsx')(boards)
  var Update = require('update.jsx')
  var Backup = require('backup.jsx')

  // Define Main Components

  var Container = React.createClass({
    render () {
      return (<div className='container app'>{this.props.children}</div>)
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
      return <Static className='homepage' content={require('landing.md')} />
    }
  })

  var NotFound = React.createClass({
    render () {
      return (<div className='text-center'>
        <h1><Icon name='ban' className='light'/></h1>
        <h3>Sorry, there's nothing here!</h3>
      </div>)
    }
  })

  var RootComponent = React.createClass({
    getInitialState () {
      return {}
    },
    componentDidMount () {
      require.ensure(['react-router'], _ => {
        this.setState(require('react-router'))
      })
    },
    render () {
      if (this.state.Router) {
        var Router = this.state.Router
        var IndexRoute = this.state.IndexRoute
        var Route = this.state.Route
        return <Router>
          <Route path='/' component={App}>
            <IndexRoute component={Homepage} />
            <Route path='/@:userid'>
              <IndexRoute component={Profile} />
              <Route path='post/:posthash' >
                <IndexRoute component={PostPage} />
              </Route>
              <Route path=':boardname'>
                <IndexRoute component={Board} />
                <Route path=':posthash'>
                  <IndexRoute component={PostPage} />
                  <Route path=':commenthash' component={CommentPage} />
                </Route>
              </Route>
            </Route>
            <Route path='edit'>
              <Route path='profile' component={ProfileEditor} />
              <Route path='board(/:boardname)'>
                <IndexRoute component={BoardEditor} />
                <Route path='post(/:posthash)' component={PostEditor} />
              </Route>
            </Route>
            <Route path='post/:posthash' component={PostPage} />
            <Route path='board/:boardname' component={Board} />
            <Route path='users' component={Users} />
            <Route path='settings' component={Settings} />
            <Route path='status' component={Status} />
            <Route path='version' component={Update} />
            <Route path='backup' component={Backup} />
            <Route path='restore' component={Backup} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      } else {
        return <div className='loading' style={{ marginTop: '2rem' }} >
          <div className='text-center'>
            <Icon className='center-block fa-spin fa-3x light' name='refresh' />
            <h4 className='top-half-em'>Downloading Components</h4>
          </div>
        </div>
      }
    }
  })
  require.ensure('react-dom', _ => {
    var ReactDOM = require('react-dom')
    ReactDOM.render(
      <RootComponent />, document.getElementById('root')
    )
  })
})
