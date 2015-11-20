var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = function(boards){
  return React.createClass({
    getInitialState: function(){
      return { }
    },
    componentDidMount: function(){
      if(this.props.id) boards.getProfile(this.props.id, (err,res) => {
        if(!this.isMounted()) return true
        if(!err) {
          this.setState({ name: res.name || 'Unknown Name' })
        }
      })
    },
    getContent: function(){
      if(this.state.name){
        return (<Icon name="user" />)
      } else {
        return '@'
      }
    },
    render: function(){
      if(this.props.id)
        return (<div className="user-id">
          <Link className="light nounderline" to={'/@'+this.props.id}>
            {this.getContent()}{this.state.name || this.props.id}
          </Link>
        </div>)
      else return <div className="user-id">
          <Icon name="ban" /> Unknown User
        </div>
    }
  })
}
