var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = function(boardsAPI){
  var UserID = require('userID.jsx')(boardsAPI)
  return React.createClass({
    getDate: function(){
      if(this.props.post.date){
        if(this.state.moment)
          return this.state.moment.unix(this.props.post.date).fromNow()
        else return '...'
      } else {
        return 'Unknown Date'
      }
    },
    getInitialState: function(){
      return { moment: false }
    },
    componentDidMount: function(){
      require.ensure(['moment'],_ => {
        if(this.isMounted()) this.setState({ moment: require('moment') })
      })
    },
    render: function(){
      return <div key={this.props.post.title} className="post">
        <div className="content">
          <h5>{this.props.post.title}</h5><hr/>
          <Markdown source={this.props.post.text} skipHtml={true} /><hr/>
          <div className="icons">
            <UserID id={this.props.post.op}></UserID>
            <Icon name="clock-o" className="not-first"/> {this.getDate()}
            <Icon name="comments" className="not-first" />
            <Link to={this.props.link || '/post/'+this.props.post.hash }>Comments</Link>
          </div>
        </div>
      </div>
    }
  })
}
