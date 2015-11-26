var React = require('react')

module.exports = function(boardsAPI){
  var Comment = require('comment.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { comments: [] }
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
        boards.getEventEmitter().on('comment for '+this.props.parent,cmnt => {
          if(this.isMounted()) this.setState({ comments: this.state.comments.concat(cmnt) })
        })
        if(boards.isInit && this.isMounted()){
          boards.getCommentsFor(this.props.parent,this.props.board,this.props.adminID)
        }
        boards.getEventEmitter().on('init', err => {
          if(!err && this.isMounted())
            boards.getCommentsFor(this.props.parent,this.props.board,this.props.adminID)
        })
      })
    },
    getComments: function(){
      if(this.state.comments.length > 0)
        return this.state.comments.map(cmnt => (<Comment key={cmnt.hash} comment={cmnt} post={this.props.post} comments={this} adminID={this.props.adminID} board={this.props.board}/>) )
      else return <div></div>
    },
    render: function(){
      return <div className={this.props.className+' comments'} >{this.getComments()}</div>
    }
  })
}
