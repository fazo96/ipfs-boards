var React = require('react')
var GetIPFS = require('getipfs.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link
var { Error, Loading, Saving } = require('status-components.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState () {
      return { }
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
    init (boards) {
      if (this.state.init) return
      this.setState({ api: boards, init: true })
      this.getBoardSettings(boards)
    },
    getBoardSettings (boards) {
      if (!this.props.params.boardname) return
      this.setState({ loading: true })
      boards.getBoardSettings(boards.getMyID(), this.props.params.boardname, (err, s) => {
        if (err) {
          this.setState({ error: err, loading: false })
        } else if (this.state.loading) {
          this.setState({
            id: this.props.params.boardname,
            name: s.fullname,
            desc: s.description,
            loading: false
          })
        }
      })
    },
    handleChange (event) {
      var obj = {}
      obj[event.target.id] = event.target.value
      this.setState(obj)
    },
    skip () {
      this.setState({ loading: false, updating: false, error: false })
    },
    refresh () {
      this.setState({ loading: true })
      boardsAPI.use(b => this.getBoardSettings(b))
    },
    save () {
      var boards = this.state.api
      var board = {
        id: this.state.shortname || this.props.params.boardname,
        fullname: this.state.name,
        description: this.state.desc
      }
      this.setState({ updating: true })
      boards.createBoard(board, (err) => {
        this.setState({ updating: false })
        console.log('CREATE:', err)
      })
    },
    additionalButtons () {
      if (this.state.api && this.props.params.boardname) {
        var url = '/@' + this.state.api.getMyID() + '/' + this.props.params.boardname
        return <span>
          <button onClick={this.refresh} className="button not-first">Refresh</button>
          <Link to={url} className="button not-first">View</Link>
        </span>
      } else {
        return <span></span>
      }
    },
    render () {
      if (this.state.api) {
        if (this.state.error) {
          return <Error error={this.state.error} >
            <button className="button button-primary center-block" onClick={this.skip}>Continue</button>
          </Error>
        } else if (this.state.loading) {
          return <Loading title="Fetching your current Board Settings...">
            <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
          </Loading>
        } else if (this.state.updating) {
          return <Saving>
            <p>Pressing the Skip button will not abort the publish operation.</p>
            <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
          </Saving>
        } else {
          return (
            <div className="editor">
              <h2><Icon name="inbox" className="light" />
                {this.props.params.boardname ? ' Board Settings' : ' New Board'}
              </h2>
              <p>This App uses IPFS to store your Boards. When you are offline,
              other users or servers that viewed your content will serve it to
              others.</p>
              <p><b>Warning:</b> due to a bug in go-ipfs, it may take up to a minute
              for your changes to be visibile. Your Boards will appear unchanged during
              this time.</p>
              <div className="row">
                {this.props.params.boardname
                  ? <div></div>
                  : <div className="six columns">
                    <label htmlFor="shortname">ID</label>
                    <input className="u-full-width" type="text" id="shortname" value={this.state.id} onChange={this.handleChange} placeholder="Choose a short ID." />
                  </div>}
                <div className={(this.props.params.boardname ? 'twelve' : 'six') + ' columns'}>
                  <label htmlFor="name">Title</label>
                  <input className="u-full-width" type="text" id="name" value={this.state.name} onChange={this.handleChange} placeholder="Name your board" />
                </div>
              </div>
              <div>
                <label htmlFor="desc">Description</label>
                <textarea className="u-full-width" id="desc" value={this.state.desc} onChange={this.handleChange} placeholder="What's this Board about? Markdown is supported :)" />
              </div>
              <div className="buttons">
                <button className="button button-primary" onClick={this.save}>Publish</button>
                {this.additionalButtons()}
              </div>
            </div>
          )
        }
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
