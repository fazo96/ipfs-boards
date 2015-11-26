var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Clock = require('clock.jsx')
var Link = require('react-router').Link

module.exports = function(boardsAPI){
  var UserID = require('userID.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { moment: false }
    },
    componentDidMount: function(){
      require.ensure(['moment'],_ => {
        if(this.isMounted()) this.setState({ moment: require('moment') })
      })
    },
    getPermalink: function(){
      if(this.props.adminID && this.props.board && this.props.post && this.props.comment.hash){
        return <div className="inline not-first">
          <Icon name="code" /> <Link to={'/@'+this.props.adminID+'/'+this.props.board+'/'+this.props.post+'/'+this.props.comment.hash}>Permalink</Link>
        </div>
      }
    },
    getParentlink: function(){
      if(this.props.showParent && this.props.comment.parent && this.props.comment.parent !== this.props.post){
        return <div className="inline not-first">
          <Icon name="level-up" /> <Link to={'/@'+this.props.adminID+'/'+this.props.board+'/'+this.props.post+'/'+this.props.comment.parent}>Parent</Link>
        </div>
      }
    },
    render: function(){
      if(this.props.comment){
        var Comments = this.props.comment.comments || require('comments.jsx')(boardsAPI)
        return <div className="comment"><hr/>
          <div className="icons">
            <UserID id={this.props.comment.op} />
            <Clock date={this.props.comment.date} />
            {this.getPermalink()}
            {this.getParentlink()}
          </div>
          <Markdown source={this.props.comment.text} />
          <Comments className="shifted" parent={this.props.comment.hash} post={this.props.post} adminID={this.props.adminID} board={this.props.board}/>
        <hr/></div>
      } else {
        return <div><hr/>Invalid Comment<hr/></div>
      }
    }
  })
}
