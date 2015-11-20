var React = require('react')
var Icon = require('icon.jsx')

module.exports = function(boards){
  var UserID = require('userID.jsx')(boards)
  return React.createClass({
    getInitialState: function(){
      return { users: boards.getUsers() }
    },
    componentDidMount: function(){
      boards.searchUsers().on('user',(id) => {
        if(id === undefined) console.log('found undefined user???')
        if(this.isMounted() && this.state.users.indexOf(id) < 0)
          this.setState({ users: this.state.users.concat(id) })
      })
    },
    render: function(){
      return <div>
        <h1><Icon name="users" /> Users</h1>
        <p>Found <b>{this.state.users.length}</b> users</p>
        <ul>
          {this.state.users.map(user => {
            return <UserID key={user} id={user} />
          })}
        </ul>
      </div>
    }
  })
}
