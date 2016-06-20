var React = require('react')
var GetIPFS = require('getipfs.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link
var { Error, Loading, Saving, Success } = require('status-components.jsx')

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
    componentWillReceiveProps (props) {
      if (this.props.params.posthash !== props.params.posthash) {
        boardsAPI.use(this.init)
      }
    },
    init (boards) {
      this.setState({ api: boards, userid: boards.getMyID(), downloaded: false, title: undefined, text: undefined })
      if (this.props.params.posthash) this.downloadPost(boards)
    },
    downloadPost (boards) {
      this.setState({ loading: true })
      boards.downloadPost(this.props.params.posthash, (err, hash, date, post) => {
        if (err) {
          this.setState({ error: err, loading: false, downloaded: false })
        } else {
          console.log(post)
          this.setState({ loading: false, title: post.title, text: post.text, downloaded: true })
        }
      })
    },
    handleChange (event) {
      var obj = {}
      obj[event.target.id] = event.target.value
      this.setState(obj)
    },
    skip () {
      this.setState({ loading: false, updating: false, error: false, success: false })
    },
    refresh () {
      boardsAPI.use(b => this.downloadPost(b))
    },
    save () {
      this.setState({ updating: true })
      var post = {
        text: this.state.text
      }
      if (this.state.title && this.state.title.length > 0) {
        post.title = this.state.title
      }
      if (this.props.params.posthash) {
        // TODO: maybe check if downloaded? But then what if the user skipped the prev version download?
        post.previous = this.props.params.posthash
      }
      boardsAPI.use(boards => {
        boards.createPost(post, this.props.params.boardname, (err, hash) => {
          this.setState({ error: err, updating: false })
          if (!err) {
            var url = '/edit/board/' + this.props.params.boardname + '/post/' + hash
            this.props.history.push(url)
          }
        })
      })
    },
    delete () {
      this.setState({ deleting: true })
      boardsAPI.use(boards => {
        boards.deletePost(this.props.params.posthash, this.props.params.boardname, err => {
          if (!err) console.log('Post deleted')
          this.setState({ deleting: false, error: err, success: true })
        })
      })
    },
    additionalButtons () {
      if (this.state.api && this.props.params.posthash) {
        var url = '/@' + this.state.api.getMyID() + '/' + this.props.params.boardname + '/' + this.props.params.posthash
        return <span>
          <button onClick={this.refresh} className='button not-first'>Refresh</button>
          <Link to={url} className='button not-first'>View</Link>
          <button onClick={this.delete} className='button not-first'>Delete</button>
        </span>
      } else {
        return <span></span>
      }
    },
    render () {
      if (this.state.api) {
        if (this.state.error) {
          return <Error error={this.state.error} >
            <button className='button button-primary center-block' onClick={this.skip}>Continue</button>
          </Error>
        } else if (this.state.deleting) {
          return <Loading title='Deleting Post'>
            <p>Pressing the Skip button will not abort the Delete operation.</p>
            <button className='button button-primary center-block' onClick={this.skip}>Skip</button>
          </Loading>
        } else if (this.state.loading) {
          return <Loading title='Downloading Post'>
            <button className='button button-primary center-block' onClick={this.skip}>Skip</button>
          </Loading>
        } else if (this.state.updating) {
          return <Saving>
            <p>Pressing the Skip button will not abort the publish operation.</p>
            <button className='button button-primary center-block' onClick={this.skip}>Skip</button>
          </Saving>
        } else if (this.state.success) {
          return <Success title='Post Deleted'>
            <p><b>Note:</b> due to a bug in go-ipfs, you may need to wait up to a minute for changes to appear.</p>
          </Success>
        } else {
          return (
            <div className='editor'>
              <h2><Icon name='pencil' className='light' />
                {this.props.params.posthash ? ' Edit Post' : ' New Post'}
              </h2>
              <p>This App uses IPFS to store your Posts. When you are offline,
              other users or servers that viewed your text will serve it to
              others.</p>
              <p><b>Warning:</b> due to a bug in go-ipfs, it may take up to a minute
              for your changes to be visibile. Your Post will not appear or appear
              unchanged during this time.</p>
              <div>
                <label htmlFor='title'>Title</label>
                <input className='u-full-width' type='text' id='title' value={this.state.title} onChange={this.handleChange} placeholder='Choose a title' />
              </div>
              <div>
                <label htmlFor='text'>Content</label>
                <textarea className='u-full-width' id='text' value={this.state.text} onChange={this.handleChange} placeholder='Write your post. Markdown is supported :)' />
              </div>
              <div className='buttons'>
                <button className='button button-primary' onClick={this.save}>Publish</button>
                {this.additionalButtons()}
              </div>
            </div>
          )
        }
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
