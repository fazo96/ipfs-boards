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
      this.setState({ api: boards, userid: boards.getMyID(), init: true })
      if (this.props.params.posthash) this.downloadPost(boards)
    },
    downloadPost (boards) {
      this.setState({ loading: true })
      boards.downloadPost(this.props.params.posthash, (err, p) => {
        if (err) {
          this.setState({ error: err, loading: false })
        } else {
          this.setState({ loading: false, title: p.title, text: p.text })
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
      boardsAPI.use(b => this.downloadPost(b))
    },
    save () {
      this.setState({ updating: true })
      var post = {
        title: this.state.title,
        text: this.state.text
      }
      boardsAPI.use(boards => {
        boards.createPost(post, this.props.params.boardname, err => {
          this.setState({ error: err, updating: false })
          // Should redirect to new post hash
        })
      })
    },
    additionalButtons () {
      if (this.state.api && this.props.params.posthash) {
        var url = '/@' + this.state.api.getMyID() + '/' + this.props.params.boardname + '/' + this.props.params.posthash
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
          return <Loading title="Downloading Post">
            <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
          </Loading>
        } else if (this.state.updating) {
          return <Saving>
            <p>Pressing the Skip button will not abort the publish operation.</p>
            <button className="button button-primary center-block" onClick={this.skip}>Skip</button>
          </Saving>
        } else {
          if (this.state.userid && this.props.params.boardname) {
            var boardurl = '/@' + this.state.userid + '/' + this.props.params.boardname
          }
          return (
            <div className="editor">
              <h2><Icon name="pencil" className="light" />
                {this.props.params.posthash ? ' Edit Post' : ' New Post'}
              </h2>
              <p>This App uses IPFS to store your Posts. When you are offline,
              other users or servers that viewed your text will serve it to
              others.</p>
              <p><b>Warning:</b> due to a bug in go-ipfs, it may take up to a minute
              for your changes to be visibile. Your Post will not appear or appear
              unchanged during this time.</p>
              <div>
                <label htmlFor="title">Title</label>
                <input className="u-full-width" type="text" id="title" value={this.state.title} onChange={this.handleChange} placeholder="Choose a title" />
              </div>
              <div>
                <label htmlFor="text">Content</label>
                <textarea className="u-full-width" id="text" value={this.state.text} onChange={this.handleChange} placeholder="Write your post. Markdown is supported :)" />
              </div>
              <div className="buttons">
                <button className="button button-primary" onClick={this.save}>Publish</button>
                {boardurl ? <Link className="button not-first" to={boardurl}>View Board</Link> : <span></span> }
                {this.additionalButtons()}
              </div>
            </div>
          )
        }
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
