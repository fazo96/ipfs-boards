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
    // TODO: merge these (duplicated code) and use css to get desired style
    if (this.props.small) {
      return <div>
        <div className="text-center">
          <Icon className="center-block fa-spin fa-2x light" name="refresh" />
          <h5 className="top-half-em">{this.props.title}</h5>
          { this.props.children }
        </div>
      </div>
    } else {
      return <div>
        <div className="text-center">
          <Icon className="center-block fa-spin fa-3x light" name="refresh" />
          <h4 className="top-half-em">{this.props.title}</h4>
          { this.props.children }
        </div>
      </div>
    }
  }
})

var Saving = React.createClass({
  render () {
    return <div>
      <div className="text-center">
        <Icon className="center-block fa-spin fa-3x light" name="refresh" />
        <h4 className="top-half-em">{ this.props.title || 'Publishing' }</h4>
        { this.props.children }
      </div>
    </div>
  }
})

var Success = React.createClass({
  render () {
    return <div>
      <div className="text-center">
        <Icon className="center-block fa-3x light" name="check" />
        <h4 className="top-half-em">{ this.props.title || 'Done' }</h4>
        { this.props.children }
      </div>
    </div>
  }
})

module.exports = { Error, Loading, Saving, Success }
