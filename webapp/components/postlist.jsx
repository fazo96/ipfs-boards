var React = require('react')
var sortedIndex = require('lodash.sortedindex')
var Icon = require('icon.jsx')
var Post = require('post.jsx')

module.exports = React.createClass({
  getInitialState () {
    return { posts: [] }
  },
  sortFn (a, b) {
    return (b.date || 0) - (a.date || 0)
  },
  componentWillReceiveProps (props) {
    if (props.api && (this.props.board !== props.board || this.props.admin !== props.admin)) {
      this.init(props.api, props)
    }
  },
  init (boards, props) {
    var onPost = (hash, date, post) => {
      if (!this.isMounted()) return true
      var now = parseInt((new Date()).getTime() / 1000, 10)
      var posts = this.state.posts
      if (date === undefined || date <= 0) {
        posts.push(hash)
      } else /* if (date <= now) */ {
        var i = sortedIndex(posts, post, (p) => now - date || now)
        posts.splice(i, 0, hash)
      } /* else {
        console.log('Post discarded cause date in the future:', hash)
      }*/
      // Don't drop posts in the future due to date sync problems!
      // TODO: delete old version of post from list?
      this.setState({ posts })
    }
    props = props || this.props
    boards.getEventEmitter().on('post in ' + props.board + (props.admin ? '@' + props.admin : ''), onPost)
    this.setState({ api: boards, limited: boards.limited })
    if (boards.isInit) {
      boards.getPostsInBoard(props.admin, props.board)
    } else {
      boards.getEventEmitter().on('init', (err, limited) => {
        if (!err) {
          boards.getPostsInBoard(props.admin, props.board)
        } else {
          this.setState({ limited })
        }
      })
    }
  },
  componentDidMount () {
    var boards = this.props.api
    if (boards) {
      if (boards.isInit || boards.limited) {
        this.init(boards)
      } else {
        boards.getEventEmitter().on('init', (err, limited) => {
          if ((!err || limited) && this.isMounted()) this.init(boards)
        })
      }
    }
  },
  getPosts () {
    if (this.state.posts.length > 0 || this.state.api) {
      return this.state.posts.map(hash => {
        return <Post key={hash} board={this.props.board} admin={this.props.admin} hash={hash} api={this.props.api} />
      })
    } else {
      return <div className='center-block text-center'>
        <Icon name='refresh' className='fa-3x center-block light fa-spin' />
      </div>
    }
  },
  render () {
    if (this.state.limited) {
      return <div className='text-center'>
        <h5 className='light'><Icon name='ban' /></h5>
        <p>Posts in a board can't be shown in limited mode. Sorry!</p>
      </div>
    } else {
      return <div className='postList'>
        {this.getPosts()}
      </div>
    }
  }
})
