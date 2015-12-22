var React = require('react')

module.exports = React.createClass({
  class: function () {
    return 'fa fa-' + this.props.name + ' ' + this.props.className
  },
  render: function () {
    return (<i className={this.class()}></i>)
  }
})
