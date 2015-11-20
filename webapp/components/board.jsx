var React = require('react')
var Markdown = require('markdown.jsx')
var Link = require('react-router').Link
var Icon = require('icon.jsx')

module.exports = function(boards){
  var UserID = require('userID.jsx')(boards)
  var PostList = require('postlist.jsx')(boards)
  return React.createClass({
    getInitialState: function(){
      return { name: this.props.params.boardname }
    },
    componentDidMount: function(){
      var ee = boards.getBoardSettings(this.props.params.userid,this.props.params.boardname)
      ee.on('settings for '+this.props.params.boardname+'@'+this.props.params.userid, (res) => {
        if(!this.isMounted()) return true
        console.log('Found name:',res.fullname)
        this.setState({ name: res.fullname.trim(), description: res.description })
      })
    },
    render: function(){
      return (<div className="board">
        <h2>{this.state.name}</h2>
        <Markdown source={this.state.description} skipHtml={true} />
        <h5><UserID id={this.props.params.userid} /></h5>
        <PostList board={this.props.params.boardname} admin={this.props.params.userid}/>
      </div>)
    }
  })
}
