var React = require('react')
var moment = require('moment')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')

module.exports = function(boards){
  var UserID = require('userID.jsx')(boards)
  return React.createClass({
    getDate: function(){
      if(this.props.post.date){
        return moment.unix(this.props.post.date).fromNow()
      } else {
        return 'Unknown Date'
      }
    },
    render: function(){
      return <div key={this.props.post.title} className="post">
        <div className="content">
          <h5>{this.props.post.title}</h5><hr/>
          <Markdown source={this.props.post.text} skipHtml={true} /><hr/>
          <div className="icons">
            <UserID id={this.props.post.op}></UserID>
            <Icon name="clock-o" className="not-first"/> {this.getDate()}
            <Icon name="comments" className="not-first" /> Comments
          </div>
        </div>
      </div>
    }
  })
}
