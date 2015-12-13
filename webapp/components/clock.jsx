var React = require('react')
var Icon = require('icon.jsx')

module.exports = React.createClass({
  getInitialState: function () {
    return { moment: false, text: '...' }
  },
  componentDidMount: function () {
    require.ensure(['moment'], _ => {
      if (this.isMounted()) {
        var moment = require('moment')
        this.setState({
          moment: moment,
          interval: setInterval(this.upDate, 60 * 1000),
          text: moment.unix(this.props.date).fromNow()
        })
      }
    })
  },
  upDate: function () {
    if (this.isMounted()) {
      this.setState({ text: this.state.moment.unix(this.props.date).fromNow() })
    } else {
      clearInterval(this.state.interval)
    }
  },
  getDate: function () {
    if (this.state.moment) {
      return this.state.text
    } else {
      return <Icon name="refresh" className="fa-spin" />
    }
  },
  render: function () {
    return <div className="inline"><Icon name="clock-o" className={this.props.className} /> {this.getDate()}</div>
  }
})
