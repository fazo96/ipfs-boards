var React = require('react')
var GetIPFS = require('getipfs.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState () {
      return { }
    },
    componentDidMount () {
      boardsAPI.use(api => this.setState({ api }))
    },
    render () {
      return <GetIPFS api={this.state.api} />
    }
  })
}
