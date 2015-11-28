var React = require('react')
var Icon = require('icon.jsx')

module.exports = function(boardsAPI){
  var GetIPFS = require('getipfs.jsx')(boardsAPI)
  var UserID = require('userID.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { users: [], api: false }
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
        boards.init()
        if(boards.isInit){
          if(this.isMounted()){
            this.setState({ api: true })
            this.init(boards)
          }
        }
        var ee = boards.getEventEmitter()
        ee.on('init', e => {
          if(!e && this.isMounted()){
            this.init(boards)
            this.setState({ api: true })
          }
        })
        ee.on('user',(id) => {
          if(id === undefined || id === 'undefined') console.log('found undefined user???')
          if(this.isMounted() && this.state.users.indexOf(id) < 0){
            this.setState({ users: this.state.users.concat(id) })
          }
        })
      })
    },
    init: function(boards){
      if(this.isMounted() && !this.state.init){
        this.setState({ users: boards.getUsers(), init: true })
        boards.searchUsers()
      }
    },
    render: function(){
      if(this.state.api){
        return <div>
          <h1><Icon name="users" /> Users</h1>
          <p>Found <b>{this.state.users.length}</b> users</p>
          <ul>
            {this.state.users.map(user => {
              return <UserID key={user} id={user} />
            })}
          </ul>
        </div>
      } else return <GetIPFS />
    }
  })
}
