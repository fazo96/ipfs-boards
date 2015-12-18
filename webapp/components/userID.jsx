var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = React.createClass({
  getInitialState () {
    return { }
  },
  componentWillReceiveProps (props) {
    this.init(props)
  },
  componentDidMount () {
    this.init()
  },
  init (props) {
    props = props || this.props
    var boards = props.api
    if (boards) {
      boards.getEventEmitter().on('init', err => {
        if (!err && this.isMounted()) this.getProfile(boards)
      })
      if (boards.isInit) {
        this.getProfile(boards)
      }
    }
  },
  getProfile (boards) {
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
  getContent () {
    if (this.state.name) {
      return (<Icon name="user" />)
    } else {
      return '@'
    }
  },
  render () {
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
