var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Clock = require('clock.jsx')
var Link = require('react-router').Link
var UserID = require('userID.jsx')
var { Error, Success } = require('status-components.jsx')

var CommentEditor = React.createClass({
  getInitialState () {
    return { }
  },
  componentDidMount () {
    this.init(this.props)
  },
  componentWillReceiveProps (props) {
    this.init(props)
  },
  init (props) {
    this.setState({ api: props.api })
  },
  handleChange (event) {
    var obj = {}
    obj[event.target.id] = event.target.value
    this.setState(obj)
  },
  save () {
    var boards = this.props.api
    var comment = { text: this.state.text }
    this.setState({ loading: true })
    boards.createComment(comment, this.props.parent, (err, hash) => {
      if (err) {
        this.setState({ loading: false, error: err })
      } else {
        this.setState({ loading: false, success: true, hash })
      }
    })
  },
  render () {
    if (this.state.error) {
      return <Error error={this.state.error} />
    } else if (this.state.loading) {
      return <div className="center-block text-center find-content">
        <Icon name="refresh" className="fa-3x center-block light fa-spin" />
        <h4>Publishing Comment</h4>
      </div>
    } else if (this.state.success) {
      var url = '/@' + this.props.adminID + '/' + this.props.board + '/' + (this.props.post || this.props.parent) + '/' + this.state.hash
      return <Success title="Comment Published">
        <Link className="button button-primary" to={url}>View</Link>
      </Success>
    } else {
      return <div>
        <textarea className="u-full-width" id="text" value={this.state.text} onChange={this.handleChange} placeholder="Speak your mind! Markdown is supported." />
        <p><b>Note</b>: this version of the app doesn't check wether you are allowed to post on this board, so there are no guarantees that your post will be visible.</p>
        <div className="buttons">
          <button className="button button-primary" onClick={this.save}>Send</button>
        </div>
      </div>
    }
  }
})

var Comment = React.createClass({
  getInitialState () {
    return { moment: false }
  },
  componentDidMount () {
    require.ensure(['moment'], _ => {
      if (this.isMounted()) this.setState({ moment: require('moment') })
    })
  },
  getPermalink () {
    if (this.props.adminID && this.props.board && this.props.post && this.props.comment.hash) {
      return <div className="inline not-first">
        <Icon name="code" /> <Link to={'/@' + this.props.adminID + '/' + this.props.board + '/' + this.props.post + '/' + this.props.comment.hash}>Permalink</Link>
      </div>
    }
  },
  getParentlink () {
    if (this.props.showParent && this.props.comment.parent) {
      return <div className="inline not-first">
        <Icon name="level-up" /> <Link to={'/@' + this.props.adminID + '/' + this.props.board + '/' + this.props.post + '/' + this.props.comment.parent}>Parent</Link>
      </div>
    }
  },
  getComments () {
    return <Comments className="shifted" allowReply={this.props.allowReply} parent={this.props.comment.hash} post={this.props.post} adminID={this.props.adminID} board={this.props.board} api={this.props.api} />
  },
  toggleReply () {
    this.setState({ reply: !this.state.reply })
  },
  render () {
    if (this.props.comment) {
      return <div className="comment"><hr/>
        <div className="icons">
          <UserID id={this.props.comment.op} api={this.props.api} />
          <Clock date={this.props.comment.date} />
          {this.getPermalink()}
          { this.props.allowReply
          ? <a className="nounderline" onClick={this.toggleReply}><Icon className="not-first" name="reply" /> Reply</a>
          : <a/> }
          {this.getParentlink()}
        </div>
        <Markdown source={this.props.comment.text} />
        { this.state.reply
        ? <CommentEditor parent={this.props.comment.hash} post={this.props.post} api={this.props.api} adminID={this.props.adminID} board={this.props.board} />
        : <div/>}
      <hr/>{this.getComments()}</div>
    } else {
      return <div><hr/>Invalid Comment<hr/></div>
    }
  }
})

var Comments = React.createClass({
  getInitialState () {
    return { comments: [] }
  },
  componentDidMount () {
    if (this.props.api) this.init(this.props.api)
  },
  componentWillReceiveProps (props) {
    if (props.api !== this.props.api) this.init(props.api)
  },
  init (boards) {
    boards.getEventEmitter().on('comment for ' + this.props.parent, cmnt => {
      if (this.isMounted()) this.setState({ comments: this.state.comments.concat(cmnt) })
    })
    boards.getEventEmitter().on('init', (err, limited) => {
      if (!this.isMounted()) return
      if (!err) {
        boards.getCommentsFor(this.props.parent, this.props.board, this.props.adminID)
      }
      if (limited) this.setState({ limited })
    })
    if (boards.isInit) {
      boards.getCommentsFor(this.props.parent, this.props.board, this.props.adminID)
    }
    if (boards.limited) this.setState({ limited: true })
  },
  getComments () {
    if (this.state.comments.length > 0) {
      return this.state.comments.map(cmnt => (<Comment allowReply={this.props.allowReply} key={cmnt.hash} comment={cmnt} post={this.props.post} adminID={this.props.adminID} board={this.props.board} api={this.props.api} />))
    } else return <div></div>
  },
  render () {
    if (this.state.limited) {
      return <div className="text-center">
        <p>Comments can't be displayed in limited mode</p>
      </div>
    } else {
      return <div className={this.props.className + ' comments'} >{this.getComments()}</div>
    }
  }
})

module.exports = { Comment, Comments, CommentEditor }
