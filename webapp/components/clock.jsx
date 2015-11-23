var React = require('react')
var Icon = require('icon.jsx')

module.exports = React.createClass({
  getInitialState: function(){
    return { moment: false }
  },
  componentDidMount: function(){
    require.ensure(['moment'],_ => {
      if(this.isMounted()) this.setState({ moment: require('moment') })
    })
  },
  getDate: function(){
    if(this.props.date){
      if(this.state.moment)
        return this.state.moment.unix(this.props.date).fromNow()
      else return <Icon name="refresh" className="fa-spin" />
    } else {
      return 'Unknown Date'
    }
  },
  render: function(){
    return <div className="clock"><Icon name="clock-o" className={this.props.className} /> {this.getDate()}</div>
  }
})
