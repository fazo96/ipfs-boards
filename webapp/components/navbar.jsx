var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { api: false, loading: true }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        if (boards.isInit) this.setState({ api: true })
        boards.getEventEmitter().on('init', err => {
          if (!this.isMounted()) return
          if (err) {
            this.setState({ loading: false, api: false })
          } else {
            this.setState({ api: true })
          }
        })
      })
    },
    extraButtons: function () {
      if (this.state.api) {
        return <span>
            <Link className="nounderline" to="/@me"><Icon name="user" className="fa-2x light"/></Link>
            <Link className="nounderline" to="/users"><Icon name="globe" className="fa-2x light"/></Link>
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
            {this.props.children || <h4><Link to="/"><Icon name="comments" className="light"/> Boards</Link></h4>}
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
