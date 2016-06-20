var React = require('react')
var Icon = require('icon.jsx')
var Link = require('react-router').Link

var Updater = React.createClass({
  getInitialState () {
    return {}
  },
  componentDidMount () {
    this.checkForUpdates()
  },
  checkForUpdates () {
    var v = window.location.pathname
    var gateway = window.location.pathname.indexOf('/ipfs/') === 0 || window.location.pathname.indexOf('/ipns/') === 0
    if (v !== '/ipns/boards.ydns.eu/' || !gateway) {
      this.setState({ update: true })
    }
  },
  render () {
    if (this.state.update) {
      return <Link className='nounderline' to='/version' >
        <Icon name='history' className='fa-2x light' />
      </Link>
    } else return <div></div>
  }
})

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { loading: true }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        if (boards.isInit) this.setState({ api: boards, userid: boards.getMyID() })
        boards.getEventEmitter().on('init', (err, limited) => {
          if (!this.isMounted()) return
          if (err) {
            this.setState({ loading: false, api: false, limited })
          } else {
            this.setState({ api: boards, userid: boards.getMyID(), limited })
          }
        })
      })
    },
    extraButtons: function () {
      if (this.state.api) {
        return <span>
            <Link className='nounderline' to={'/@' + this.state.userid}><Icon name='user' className='fa-2x light'/></Link>
            <Link className='nounderline' to='/users'><Icon name='globe' className='fa-2x light'/></Link>
          </span>
      } else if (this.state.loading) {
        return <Link className='nounderline' to='/status'><Icon name='refresh' className='fa-2x fa-spin light'/></Link>
      } else if (this.state.limited) {
        return <Link className='nounderline' to='/status'><Icon name='exclamation-triangle' className='fa-2x light'/></Link>
      } else {
        return <Link className='nounderline' to='/status'><Icon name='ban' className='fa-2x light'/></Link>
      }
    },
    render: function () {
      return (
        <div className='navbar'>
          <div className='container'>
            <h4><Link to='/'><Icon name='comments' className='light'/> Boards</Link></h4>
            <div className='u-pull-right iconbar'>
              <Updater/>
              {this.extraButtons()}
              <Link className='nounderline' to='/settings'><Icon name='cog' className='fa-2x light'/></Link>
              <a className='nounderline' href='https://github.com/fazo96/ipfs-boards'><Icon name='github' className='fa-2x light'/></a>
            </div>
          </div>
        </div>)
    }
  })
}
