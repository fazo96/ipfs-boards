var React = require('react')
var Post = require('post.jsx')

module.exports = function(boards){
  var UserID = require('userID.jsx')(boards)
  return React.createClass({
    getInitialState: function(){
      return { post: { title: '...', text: '...' }, api: boards.isInit }
    },
    componentDidMount: function(){
      boards.getEventEmitter().on('init', _ => { if(this.isMounted()) this.setState({ api: true })})
      boards.downloadPost(this.props.id,this.props.admin,this.props.board,this.props.op,(err,post) => {
        if(err){
          this.setState({ post: { title: 'Error', text: err.Message || err }})
        } else {
          this.setState({ post })
        }
      })
    },
    render: function(){
      if(this.state.api || boards.isInit)
        return <Post post={this.state.post} />
      else return <GetIPFS />
    }
  })
}
