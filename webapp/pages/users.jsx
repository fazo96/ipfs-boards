var React = require('react')
var Icon = require('icon.jsx')
var GetIPFS = require('getipfs.jsx')
var UserID = require('userID.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { users: [], api: false }
    },
    componentDidMount: function () {
      boardsAPI.use(boards => {
        boards.init()
        if (boards.isInit) {
          if (this.isMounted()) {
            this.init(boards)
          }
        }
        var ee = boards.getEventEmitter()
        ee.on('init', e => {
          if (!e && this.isMounted()) {
            this.init(boards)
          }
        })
        ee.on('user', (id) => {
          if (id === undefined || id === 'undefined') console.log('found undefined user???')
          if (this.isMounted() && this.state.users.indexOf(id) < 0) {
            this.setState({ users: this.state.users.concat(id) })
          }
        })
      })
    },
    init: function (boards) {
      if (this.isMounted() && !this.state.init) {
        this.setState({ users: boards.getUsers(), api: true, init: true, boards: boards })
        boards.searchUsers()
      }
    },
    render: function () {
      if (this.state.api) {
        return <div>
          <h1><Icon name="users" /> Users</h1>
          <p>Found <b>{this.state.users.length}</b> users</p>
          <ul>
            {this.state.users.map(user => {
              return <UserID key={user} id={user} api={this.state.boards} />
            })}
          </ul>
        </div>
      } else return <GetIPFS api={this.state.boards} />
    }
  })
}
