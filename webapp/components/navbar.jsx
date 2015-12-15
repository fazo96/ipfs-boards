var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

var Updater = React.createClass({
  componentDidMount () {
    if (this.props.api) this.checkForUpdates(this.props.api)
  },
  componentWillReceiveProps (props) {
    this.checkForUpdates(props.api)
  },
  checkForUpdates (boards) {
    var v = window.location.pathname
    if (/\/ipfs\/./.test(v)) {
      boards.getIPFS().path.resolve(v.substring(6), (err, res) => {
        console.log('PATH RESOLVE', err, res)
      })
    }
  },
  render () {
    return <div></div>
  }
})

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { loading: true }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        if (boards.isInit) this.setState({ api: boards })
        boards.getEventEmitter().on('init', err => {
          if (!this.isMounted()) return
          if (err) {
            this.setState({ loading: false, api: false })
          } else {
            this.setState({ api: boards })
          }
        })
      })
    },
    extraButtons: function () {
      if (this.state.api) {
        return <span>
            <Link className="nounderline" to="/@me"><Icon name="user" className="fa-2x light"/></Link>
            <Link className="nounderline" to="/users"><Icon name="globe" className="fa-2x light"/></Link>
            <Updater api={this.state.api} />
          </span>
      } else if (this.state.loading) {
        return <Icon name="refresh" className="fa-2x fa-spin light"/>
      } else {
        return <Link className="nounderline" to="/users"><Icon name="ban" className="fa-2x light"/></Link>
      }
    },
    render: function () {
      return (
        <div className="navbar">
          <div className="container">
            <h4><Link to="/"><Icon name="comments" className="light"/> Boards</Link></h4>
            <div className="u-pull-right iconbar">
              {this.extraButtons()}
              <Link className="nounderline" to="/settings"><Icon name="cog" className="fa-2x light"/></Link>
              <a className="nounderline" href="https://github.com/fazo96/ipfs-boards"><Icon name="github" className="fa-2x light"/></a>
            </div>
          </div>
        </div>)
    }
  })
}
