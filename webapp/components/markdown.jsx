var React = require('react')

module.exports = React.createClass({
  getInitialState: function () {
    return { lib: false }
  },
  componentDidMount: function () {
    require.ensure(['react-markdown'], _ => {
      if (this.isMounted()) this.setState({ MarkdownLib: require('react-markdown') })
    })
  },
  renderIfApplicable: function () {
    if (this.props.source) {
      if (this.state.MarkdownLib) {
        var MarkdownLib = this.state.MarkdownLib
        return <MarkdownLib source={this.props.source} skipHtml={true} />
      } else {
        return <p>{this.props.source}</p>
      }
    } else return <p>...</p>
  },
  render: function () {
    return this.renderIfApplicable()
  }
})
