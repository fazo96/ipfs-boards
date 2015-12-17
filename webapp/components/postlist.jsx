var React = require('react')
var sortedIndex = require('lodash.sortedindex')
var Icon = require('icon.jsx')
var Post = require('post.jsx')

module.exports = React.createClass({
  getInitialState: function () {
    return { posts: [], api: false }
  },
  sortFn: function (a, b) {
    return (b.date || 0) - (a.date || 0)
  },
  init: function (boards) {
    if (this.state.init) return
    this.setState({ api: true })
    var onPost = (hash, date, post) => {
      if (!this.isMounted()) return true
      var now = (new Date()).getTime()
      var posts = this.state.posts
      if (date === undefined || date <= 0) {
        posts.push(hash)
      } else /* if (date <= now) */ {
        var i = sortedIndex(posts, post, (p) => now - date || now)
        posts.splice(i, 0, hash)
      } /* else {
        console.log('Post discarded cause date in the future:', hash)
      }*/
      this.setState({ posts })
    }
    boards.getEventEmitter().on('post in ' + this.props.board + (this.props.admin ? '@' + this.props.admin : ''), onPost)
    boards.getPostsInBoard(this.props.admin, this.props.board)
    this.setState({ init: true })
  },
  componentDidMount: function () {
    var boards = this.props.api
    if (boards) {
      if (boards.isInit) {
        this.init(boards)
      } else {
        boards.getEventEmitter().on('init', err => {
          if (!err && this.isMounted()) this.init(boards)
        })
      }
    }
  },
  getPosts: function () {
    if (this.state.posts.length > 0 || this.state.api) {
      return this.state.posts.map(hash => {
        return <Post key={hash} board={this.props.board} admin={this.props.admin} hash={hash} api={this.props.api} />
      })
    } else {
      return <div className="center-block text-center">
        <Icon name="refresh" className="fa-3x center-block light fa-spin" />
      </div>
    }
  },
  render: function () {
    return (
      <div className="postList">
        {this.getPosts()}
      </div>
    )
  }
})
