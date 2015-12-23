var React = require('react')
var Icon = require('icon.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getDefaults: function () {
      return { addr: window.location.hostname, port: window.location.port, api: false }
    },
    getInitialState: function () {
      var s = window.localStorage.getItem('ipfs-boards-settings')
      var obj = this.getDefaults()
      try {
        obj = JSON.parse(s)
      } catch (e) {
        window.localStorage.removeItem('ipfs-boards-settings')
      }
      return obj || this.getDefaults()
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        if (boards.isInit || boards.limited) {
          this.setState({ api: true, limited: boards.limited })
        } else {
          this.setState({ error: boards.init_error || 'neither limited mode nor the API is available.' })
        }
        boards.getEventEmitter().on('init', (err, limited) => {
          if (this.isMounted()) {
            this.setState({ error: err, api: (!err || limited), limited })
          }
        })
      })
    },
    save: function () {
      if (isNaN(this.state.port) || parseInt(this.state.port, 10) > 65535 || parseInt(this.state.port, 10) < 1) {
        window.alert('Port number invalid')
      } else {
        window.localStorage.setItem('ipfs-boards-settings', JSON.stringify({
          addr: this.state.addr,
          port: parseInt(this.state.port, 10)
        }))
        window.location.reload(false)
      }
    },
    setDefaults: function () {
      this.setState(this.getDefaults())
    },
    onChange: function (event) {
      if (event.target.id === 'nodeAddress') {
        this.setState({ addr: event.target.value })
      } else {
        this.setState({ port: event.target.value })
      }
    },
    isOK: function () {
      if (this.state.error) {
        console.log('Error', this.state.error)
        return <div className="itsok light">
          <h5><Icon name="ban" /> Error</h5>
          <p>{this.state.error}</p>
        </div>
      } else if (this.state.limited) {
        return <div className="itsok light">
          <h5><Icon name="exclamation-triangle" /> Limited Mode</h5>
          <p>Some features may not be available.</p>
        </div>
      } else if (this.state.api) {
        return <div className="itsok light">
          <h5><Icon name="check" /> It's OK</h5>
          <p>You're connected to IPFS</p>
        </div>
      } else return <div></div>
    },
    render: function () {
      return (
        <div className="settings">
          <h2><Icon name="cog"/> Settings</h2>
          <h5>Choose how the prototype connects to IPFS</h5>
          <p>In the future, this won't be necessary because IPFS will run in your browser.</p>
          <p>All settings are saved in your browser's localStorage.</p>
          <div className="row">
            <div className="six columns">
              <label htmlFor="nodeAddress">IPFS Node</label>
              <input className="u-full-width" type="text" id="nodeAddress" value={this.state.addr} onChange={this.onChange} placeholder="localhost" />
            </div>
            <div className="six columns">
              <label htmlFor="nodePort">API Port</label>
              <input className="u-full-width" type="text" id="nodePort" value={this.state.port} onChange={this.onChange} placeholder="5001" />
            </div>
          </div>
          {this.isOK()}
          <div className="buttons">
            <button className="button button-primary" onClick={this.save}>Save</button>
            <button className="button not-first" onClick={this.setDefaults}>Defaults</button>
          </div>
        </div>
      )
    }
  })
}
