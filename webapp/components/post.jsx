var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link
var Clock = require('clock.jsx')
var UserID = require('userID.jsx')
var { Error, Loading } = require('status-components.jsx')

module.exports = React.createClass({
  getInitialState () {
    return { loading: true }
  },
  componentDidMount () {
    this.init(this.props)
  },
  componentWillReceiveProps (props) {
    this.init(props)
  },
  init (props) {
    var boards = props.api
    if (!boards) return this.setState({ error: 'Could not connect to IPFS' })
    this.setState({ loading: true, userid: boards.getMyID() })
    boards.downloadPost(props.hash, props.adminID, props.board, (err, hash, date, post) => {
      this.setState({ error: err, post: post, loading: false })
    })
  },
  postLink () {
    if (this.state.post.op) {
      if (this.props.board) {
        return '/@' + this.state.post.op + '/' + this.props.board + '/' + this.props.hash
      } else {
        return '/@' + this.state.post.op + '/post/' + this.props.hash
      }
    } else {
      return '/post/' + this.props.hash
    }
  },
  editorLink () {
    if (this.state.post.op === this.state.userid) {
      var board = this.props.board || this.state.post.board
      if (board) {
        var url = '/edit/board/' + board + '/post/' + this.props.hash
        return <Link to={url} className="nounderline">
          <Icon name="edit" className="not-first"/> Edit
        </Link>
      } else {
        return <span/>
      }
    } else return <span/>
  },
  getContent () {
    if (this.state.error) {
      return <Error className="content" error={this.state.error} />
    } else if (this.state.loading) {
      return <Loading className="content" title="Downloading post"/>
    } else {
      return <div className="content">
        { this.state.post.title
          ? <div><h5>{this.state.post.title}</h5><hr/></div>
          : <div />
        }
        <Markdown source={this.state.post.text} /><hr/>
        <div className="icons">
          <UserID id={this.state.post.op} api={this.props.api} ></UserID>
          <Clock className="not-first" date={this.state.post.date} />
          <Icon name="comments" className="not-first" /> <Link className="nounderline" to={this.postLink()}>View</Link>
          {this.editorLink()}
        </div>
      </div>
    }
  },
  render () {
    return <div className="post">{this.getContent()}</div>
  }
})
