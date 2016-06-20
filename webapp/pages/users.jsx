var React = require('react')
var Icon = require('icon.jsx')
var GetIPFS = require('getipfs.jsx')
var UserID = require('userID.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState () {
      return { users: [], api: false }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        this.init(boards)
        boards.getEventEmitter().on('user', (id) => {
          if (id === undefined || id === 'undefined') console.log('found undefined user???')
          if (this.isMounted() && this.state.users.indexOf(id) < 0) {
            this.setState({ users: this.state.users.concat(id) })
          }
        })
      })
    },
    init (boards) {
      this.setState({ users: boards.getUsers(), api: boards })
      boards.searchUsers()
    },
    render () {
      if (this.state.api) {
        return <div>
          <h1><Icon name='users' className='light' /> Users</h1>
          <p>Found <b>{this.state.users.length}</b> users</p>
          <ul>
            {this.state.users.map(user => {
              return <UserID key={user} id={user} api={this.state.api} />
            })}
          </ul>
        </div>
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
