var React = require('react')
var Link = require('react-router').Link
var UserID = require('userID.jsx')
var GetIPFS = require('getipfs.jsx')
var Post = require('post.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { }
    },
    componentDidMount: function () {
      boardsAPI.use(boards => {
        this.setState({ api: boards })
      })
    },
    getContext: function () {
      if (this.props.params.userid) {
        if (this.props.params.boardname) {
          return <div>Posted by <UserID id={this.props.params.userid} api={this.state.api} /> in <Link to={'@' + this.props.params.userid + '/' + this.props.params.boardname}>#{this.props.params.boardname}</Link></div>
        } else {
          return <div>Posted by <UserID id={this.props.params.userid} api={this.state.api} /></div>
        }
      } else return <div><h6 className="light">You are viewing a single post</h6></div>
    },
    render: function () {
      if (this.state.api) {
        return <div className="post-page">
          <div className="text-center">
            {this.getContext()}
          </div>
          <Post hash={this.props.params.posthash} board={this.props.params.boardname} api={this.state.api} />
        </div>
      } else {
        return <GetIPFS api={this.state.boards} />
      }
    }
  })
}
