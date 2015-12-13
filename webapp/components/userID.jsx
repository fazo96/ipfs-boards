var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = React.createClass({
  getInitialState: function () {
    return { }
  },
  componentDidMount: function () {
    var boards = this.props.api
    if (boards) {
      if (boards.isInit) {
        this.getProfile(boards)
      }
      boards.getEventEmitter().on('init', err => {
        if (!err && this.isMounted()) this.getProfile(boards)
        else console.log('ERR INIT', err)
      })
    }
  },
  getProfile: function (boards) {
    if (this.props.id === undefined) return
    boards.getProfile(this.props.id, (err, res) => {
      if (!this.isMounted()) return true
      if (err) {
        console.log('Error while resolving user badge:', err)
      } else {
        this.setState({ name: res.name || 'Unknown Name' })
      }
    })
  },
  getContent: function () {
    if (this.state.name) {
      return (<Icon name="user" />)
    } else {
      return '@'
    }
  },
  render: function () {
    if (this.props.id === undefined || this.props.id === 'undefined') {
      return <div className="user-id">
          <Icon name="ban" /> Unknown User
        </div>
    } else {
      return (<div className="user-id">
        <Link className="light nounderline" to={'/@' + this.props.id}>
          {this.getContent()}{this.state.name || this.props.id}
        </Link>
      </div>)
    }
  }
})
