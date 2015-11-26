var React = require('react')
var Link = require('react-router').Link

module.exports = function(boardsAPI){
  var UserID = require('userID.jsx')(boardsAPI)
  var GetIPFS = require('getipfs.jsx')(boardsAPI)
  var Post = require('post.jsx')(boardsAPI)
  var Comments = require('comments.jsx')(boardsAPI)

  return React.createClass({
    getInitialState: function(){
      return { post: { title: '...', text: '...' }, api: false }
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
        boards.init()
        boards.getEventEmitter().on('init', err => {
          if(!err && this.isMounted()){
            this.init(boards)
          }
        })
        if(this.isMounted() && boards.isInit){
          this.init(boards)
        }
      })
    },
    init: function(boards){
      if(this.state.init) return
      this.setState({ api: true })
      boards.downloadPost(this.props.params.posthash,this.props.params.userid,this.props.params.boardname,this.props.params.userid,(err,post) => {
        if(err){
          this.setState({ post: { title: 'Error', text: err.Message || err.Error }})
        } else {
          this.setState({ post })
        }
      })
    },
    getContext: function(){
      if(this.props.params.userid){
        if(this.props.params.boardname)
          return <div>Posted by <UserID id={this.props.params.userid} /> in <Link to={'@'+this.props.params.userid+'/'+this.props.params.boardname}>#{this.props.params.boardname}</Link></div>
        else
          return <div>Posted by <UserID id={this.props.params.userid} /></div>
      } else return <div><h6 className="light">You are viewing a single post</h6></div>
    },
    render: function(){
      if(this.state.api)
        return <div className="post-page">
          <div className="text-center">
            {this.getContext()}
          </div>
          <Post post={this.state.post} board={this.props.params.boardname} />
          <Comments parent={this.props.params.posthash} board={this.props.params.boardname} adminID={this.props.params.userid} post={this.props.params.posthash} />
        </div>
      else return <GetIPFS />
    }
  })
}
