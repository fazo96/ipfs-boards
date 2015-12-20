var React = require('react')
var Link = require('react-router').Link
var Icon = require('icon.jsx')

module.exports = React.createClass({
  getInitialState () {
    return {}
  },
  componentWillUnmount () {
    if (this.timer) clearTimeout(this.timer)
  },
  componentWillReceiveProps (props) {
    this.init(props)
  },
  componentDidMount () {
    this.init(this.props)
  },
  init (props) {
    var boards = props.api
    if (this.timer) clearTimeout(this.timer)
    if (boards) {
      boards.getEventEmitter().on('init', (err, limited) => {
        if (!this.isMounted()) return
        if (err) {
          this.setState({ error: true, limited })
        } else {
          this.setState({ connected: true })
        }
      })
      if (boards.isInit) {
        this.setState({ connected: true })
      } else if (boards.limited) {
        this.setState({ error: true, limited: true })
      } else this.startTimer()
    } else this.startTimer()
  },
  startTimer () {
    console.log('start timer')
    this.timer = setTimeout(_ => {
      console.log('Connection to go-ipfs has timed out (probably due to CORS)')
      if (this.isMounted() && !this.state.connected && !this.state.limited) {
        this.setState({ long: true })
      }
    }, 5000)
  },
  getContent () {
    if (this.state.limited) {
      return <div>
        <h1><Icon name="exclamation-triangle" className="light" /> You're running in limited mode</h1>
        <h4 className="light">Sorry, but at the moment an external application is needed to fully take advantage of the app</h4>
        <p>Only a few features are available in limited mode.</p>
        <h5>Why am I running in limited mode?</h5>
      </div>
    } else {
      return <div>
        <h1><Icon name="ban" className="light" /> Connection to IPFS not available</h1>
        <h4 className="light">Sorry, but at the moment an external application is needed to try the Prototype</h4>
        <p><b>Tip:</b> you can also run in limited mode by loading the app from an IPFS Gateway.</p>
      </div>
    }
  },
  render () {
    var opt = require('options.jsx').get()
    if (this.state.error || this.state.long) {
      return (
      <div>
        {this.getContent()}
        <p>You don't have an IPFS node running at <code>{opt.addr}:{opt.port}</code> or it is not reachable.
        The IPFS Boards prototype requires a full IPFS node. Please start one by following the
        <a href="https://github.com/ipfs/go-ipfs"><code>go-ipfs</code> documentation.</a></p>
        <h5>Do you have a running node but the app won't work?</h5>
        <p>It's probably one of these issues:</p>
        <ul>
          <li>Your node is not located at <code>{opt.addr}:{opt.port}</code>. Go to the <Link to="/settings">Settings Page</Link> to configure the connection.</li>
          <li>You edited your settings and saved them but didn't reload the page</li>
          <li>Your IPFS node doesn't allow requests from the domain you're running the app from (CORS issue). See <a href="https://github.com/fazo96/ipfs-board/blob/master/ipfs_daemon_set_cors.sh">here</a> for the fix.</li>
          <li>You're downloading the app via `https`: at the moment, connecting to IPFS only works if you donwload the app via plain HTTP. If you're using `ipfs.io` please consider accessing the app via a local gateway like `localhost:8080`</li>
          <li>Some other networking or browser security issue is preventing the App from talking to your node.</li>
        </ul>
        <p>Still can't fix it? <a href="https://github.com/fazo96/ipfs-board/issues">File a issue on GitHub</a>, we'll be happy to help!</p>
      </div>
    ) } else if (this.state.connected) {
      return <div class="text-center">
        <h1><Icon name="check" /></h1>
        <h5 class="light">You're connected!</h5>
      </div>
    } else {
      return <div className="center-block text-center">
        <Icon name="refresh" className="fa-3x center-block light fa-spin" />
        <h4>Connecting to IPFS</h4>
      </div>
    }
  }
})
