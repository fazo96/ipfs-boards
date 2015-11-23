var React = require('react')

module.exports = function(boardsAPI){
  var UserID = require('userID.jsx')(boardsAPI)
  var GetIPFS = require('getipfs.jsx')(boardsAPI)
  var Post = require('post.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { post: { title: '...', text: '...' }, api: false }
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
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
    render: function(){
      if(this.state.api)
        return <Post post={this.state.post} board={this.props.params.boardname} />
      else return <GetIPFS />
    }
  })
}
