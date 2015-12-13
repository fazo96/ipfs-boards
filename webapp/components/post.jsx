var React = require('react')
var Markdown = require('markdown.jsx')
var Icon = require('icon.jsx')
var Link = require('react-router').Link
var Clock = require('clock.jsx')
var UserID = require('userID.jsx')

module.exports = React.createClass({
  getInitialState: function () {
    return { moment: false }
  },
  componentDidMount: function () {
    require.ensure(['moment'], _ => {
      if (this.isMounted()) this.setState({ moment: require('moment') })
    })
  },
  postLink: function () {
    if (this.props.post.op) {
      if (this.props.board) {
        return '/@' + this.props.post.op + '/' + this.props.board + '/' + this.props.post.hash
      } else {
        return '/@' + this.props.post.op + '/post/' + this.props.post.hash
      }
    } else {
      return '/post/' + this.props.post.hash
    }
  },
  render: function () {
    return <div key={this.props.post.title} className="post">
      <div className="content">
        <h5>{this.props.post.title}</h5><hr/>
        <Markdown source={this.props.post.text} /><hr/>
        <div className="icons">
          <UserID id={this.props.post.op} api={this.props.api} ></UserID>
          <Clock className="not-first" date={this.props.post.date} />
          <Icon name="comments" className="not-first" /> <Link className="nounderline" to={this.postLink()}>View</Link>
        </div>
      </div>
    </div>
  }
})
