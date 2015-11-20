var React = require('react')
var MarkdownLib = require('react-markdown')

module.exports = React.createClass({
  renderIfApplicable: function(){
    if(this.props.source)
      return <MarkdownLib source={this.props.source} skipHtml={true} />
    return <p>...</p>
  },
  render: function(){
    return this.renderIfApplicable()
  }
})
