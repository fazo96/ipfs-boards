var React = require('react')
require('font-awesome.min.css')

module.exports = React.createClass({
  class: function () {
    return 'fa fa-' + this.props.name + ' ' + this.props.className
  },
  render: function () {
    return (<i className={this.class()}></i>)
  }
})
