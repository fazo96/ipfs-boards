var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Clock = require('clock.jsx')
var Link = require('react-router').Link
var UserID = require('userID.jsx')

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
    if (this.props.showParent && this.props.comment.parent && this.props.comment.parent !== this.props.post) {
      return <div className="inline not-first">
        <Icon name="level-up" /> <Link to={'/@' + this.props.adminID + '/' + this.props.board + '/' + this.props.post + '/' + this.props.comment.parent}>Parent</Link>
      </div>
    }
  },
  getComments () {
    return <Comments className="shifted" parent={this.props.comment.hash} post={this.props.post} adminID={this.props.adminID} board={this.props.board} api={this.props.api} />
  },
  render () {
    if (this.props.comment) {
      return <div className="comment"><hr/>
        <div className="icons">
          <UserID id={this.props.comment.op} api={this.props.api} />
          <Clock date={this.props.comment.date} />
          {this.getPermalink()}
          {this.getParentlink()}
        </div>
        <Markdown source={this.props.comment.text} />
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
    if (props.api) this.init(props.api)
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
      return this.state.comments.map(cmnt => (<Comment key={cmnt.hash} comment={cmnt} post={this.props.post} adminID={this.props.adminID} board={this.props.board} api={this.props.api} />))
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

module.exports = { Comment, Comments }
