var React = require('react')
var Icon = require('icon.jsx')

var Error = React.createClass({
  render () {
    return <div>
      <div className="text-center">
        <Icon className="center-block fa-3x light" name="ban" />
        <h4 className="top-half-em">Ooops</h4>
        <p>{'' + this.props.error || 'Something went wrong'}</p>
        { this.props.children }
      </div>
    </div>
  }
})

var Loading = React.createClass({
  render () {
    return <div>
      <div className="text-center">
        <Icon className="center-block fa-spin fa-3x light" name="refresh" />
        <h4 className="top-half-em">{this.props.title}</h4>
        { this.props.children }
      </div>
    </div>
  }
})

var Saving = React.createClass({
  render () {
    return <div>
      <div className="text-center">
        <Icon className="center-block fa-spin fa-3x light" name="refresh" />
        <h4 className="top-half-em">Publishing...</h4>
        { this.props.children }
      </div>
    </div>
  }
})

module.exports = { Error, Loading, Saving }
