var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')

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
    getDate: function(){
      if(this.props.comment.date){
        if(this.state.moment)
          return this.state.moment.unix(this.props.comment.date).fromNow()
        else return '...'
      } else {
        return 'Unknown Date'
      }
    },
    render: function(){
      if(this.props.comment){
        return <div className="comment"><hr/>
          <div className="icons">
            <UserID id={this.props.comment.op} />
            <Icon name="clock-o" className="not-first"/> {this.getDate()}
          </div>
          <Markdown source={this.props.comment.text} />
        <hr/></div>
      } else {
        return <div><hr/>Invalid Comment<hr/></div>
      }
    }
  })
}
