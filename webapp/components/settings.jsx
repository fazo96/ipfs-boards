var React = require('react')
var Icon = require('icon.jsx')

module.exports = function(boards){
  return React.createClass({
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
              <label htmlFor="nodeAddress">IPFS Node</label>
              <input className="u-full-width" type="text" id="nodeAddress" value={this.state.addr} onChange={this.onChange} placeholder="localhost" />
            </div>
            <div className="six columns">
              <label htmlFor="nodePort">API Port</label>
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

}
