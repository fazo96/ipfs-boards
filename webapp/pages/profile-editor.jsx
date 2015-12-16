var React = require('react')
var GetIPFS = require('getipfs.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState () {
      return { loading: true }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        boards.init()
        boards.getEventEmitter().on('init', err => {
          if (!err && this.isMounted()) {
            this.init(boards)
          }
        })
        if (this.isMounted() && boards.isInit) {
          this.init(boards)
        }
      })
    },
    getProfile (boards) {
      boards.getProfile(boards.getMyID(), (err, p) => {
        if (!this.isMounted()) return
        else if (err) this.setState({ loading: false })
        else if (this.state.loading) {
          // State isn't set to p directly to avoid XSS.
          // There is no knowing what's gonna be in a profile
          // Should also convert to string and check length etc.
          this.setState({ name: p.name, description: p.description, loading: false })
        }
      })
    },
    init (boards) {
      if (this.state.init) return
      this.setState({ api: boards })
      this.getProfile(boards)
    },
    handleChange (event) {
      if (event.target.id === 'name') {
        this.setState({ name: event.target.value })
      } else {
        this.setState({ description: event.target.value })
      }
    },
    skip () {
      this.setState({ loading: false, updating: false, error: false })
    },
    refresh () {
      this.setState({ loading: true })
      boardsAPI.use(b => this.getProfile(b))
    },
    save () {
      var boards = this.state.api
      var profile = {
        name: this.state.name,
        description: this.state.description
      }
      this.setState({ updating: true })
      boards.createProfile(profile, err => {
        this.setState({ error: err, updating: false })
        if (err) console.log('Profile Publish error:', err)
      })
    },
    render () {
      if (this.state.api) {
        if (this.state.error) {
          return <div>
            <div className="text-center">
              <Icon className="center-block fa-3x light" name="ban" />
              <h4 className="top-half-em">Ooops</h4>
              <p>{'' + this.state.error}</p>
              <button className="button button-primary center-block" onClick={this.skip}>Continue</button>
            </div>
          </div>
        } else if (this.state.loading) {
          return <div>
            <div className="text-center">
              <Icon className="center-block fa-spin fa-3x light" name="refresh" />
              <h4 className="top-half-em">Fetching your current profile...</h4>
              <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
            </div>
          </div>
        } else if (this.state.updating) {
          return <div>
            <div className="text-center">
              <Icon className="center-block fa-spin fa-3x light" name="refresh" />
              <h4 className="top-half-em">Publishing...</h4>
              <p>Pressing the Skip button will not abort the publish operation.</p>
              <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
            </div>
          </div>
        } else {
          return (
            <div className="editor">
              <h2><Icon name="user" className="light" /> Edit Profile</h2>
              <p>This App uses IPFS to store your profile. When you are offline,
              other users or servers that viewed your profile will serve it to
              others.</p>
            <p><b>Warning:</b> due to a bug in go-ipfs, it may take up to a minute
            for your changes to be visibile. Your profile will appear unchanged during
            this time.</p>
              <div className="center-block thin">
                <label htmlFor="name">Name</label>
                <input className="u-full-width" type="text" id="name" value={this.state.name} onChange={this.handleChange} placeholder="Who are you on the interwebs?" />
              </div>
              <div>
                <label htmlFor="desc">Caption</label>
                <textarea className="u-full-width" id="desc" value={this.state.description} onChange={this.handleChange} placeholder="Say something about yourself." />
              </div>
              <div className="buttons">
                <button className="button button-primary" onClick={this.save}>Publish</button>
                <button onClick={this.refresh} className="button not-first">Refresh</button>
                <Link to='/@me' className="button not-first">View</Link>
              </div>
            </div>
          )
        }
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
