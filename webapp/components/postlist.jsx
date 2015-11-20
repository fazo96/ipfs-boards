var React = require('react')
var moment = require('moment')
var sortedIndex = require('lodash.sortedindex')

module.exports = function(boards){
  var Post = require('post.jsx')(boards)
  return React.createClass({
    getInitialState: function(){
      return { posts: [] }
    },
    sortFn: function(a,b){
      return (b.date || 0) - (a.date || 0)
    },
    componentDidMount: function(){
      console.log('Initial POSTS',this.state.posts.length)
      boards.getPostsInBoard(this.props.admin,this.props.board)
      .on('post in '+this.props.board+'@'+this.props.admin,(post,hash) => {
        if(!this.isMounted()) return true
        var now = moment().unix()
        var posts = this.state.posts
        if(post.date === undefined || post.date <= 0){
          posts.push(post)
        } else if(post.date <= now){
          var i = sortedIndex(posts,post,(p) => now-p.date || now)
          posts.splice(i,0,post)
        } else {
          console.log('Post discarded cause date in the future:',post)
        }
        this.setState({ posts })
      })
    },
    render: function(){
      return (
        <div className="postList">
          {this.state.posts.map(post => {
            return <Post key={post.title+post.text} post={post} />
          })}
        </div>
      )
    }
  })
}
