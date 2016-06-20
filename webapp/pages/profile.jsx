var React = require('react')
var Markdown = require('markdown.jsx')
var Link = require('react-router').Link
var Icon = require('icon.jsx')
var GetIPFS = require('getipfs.jsx')
var { Loading, Error } = require('status-components.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState () {
      return { loading: true, boards: [], api: false }
    },
    componentDidMount () {
      boardsAPI.use(boards => {
        if (boards.isInit || boards.limited) {
          this.init(boards)
        }
        var ee = boards.getEventEmitter()
        ee.on('init', (err, limited) => {
          if ((!err || limited) && this.isMounted()) {
            this.init(boards)
          }
        })
      })
    },
    componentWillReceiveProps (nextProps) {
      boardsAPI.use(boards => this.downloadProfile(boards, nextProps))
      this.setState({ loading: true })
    },
    downloadProfile (boards, props) {
      var ee = boards.getEventEmitter()
      var uid = props.params.userid
      ee.on('boards for ' + uid, l => {
        var u2id = props.params.userid
        if (!this.isMounted() || u2id !== uid) return true
        this.setState({ boards: l })
      })
      boards.getProfile(uid, (err, res) => {
        if (!this.isMounted()) return true
        if (err) {
          this.setState({ loading: false, error: err })
        } else {
          this.setState({ loading: false, name: res.name, description: res.description })
        }
      })
    },
    init (boards) {
      if (this.state.init) return
      this.setState({ init: true, api: boards, id: boards.id, limited: boards.limited })
      this.downloadProfile(boards, this.props)
    },
    linkToEditor () {
      var uid = this.props.params.userid
      if (uid === this.state.id) {
        return <div className='your-profile'>
          <h6>This is your profile</h6>
          <div className='iconbar'>
            <Link className='nounderline' to='/edit/profile'><Icon name='edit' className='fa-2x light'/></Link>
          </div>
          <hr/>
        </div>
      }
      return ''
    },
    getEditButton () {
      return <Link className='button button-primary' to='/edit/profile'>Edit Profile</Link>
    },
    render () {
      if (this.state.api) {
        if (this.state.error) {
          return <Error error={this.state.error}>{this.getEditButton()}</Error>
        } else if (this.state.loading) {
          return <Loading title='Downloading Profile'>{this.getEditButton()}</Loading>
        } else {
          var uid = this.props.params.userid
          return (<div className='profile'>
            {this.linkToEditor()}
            <h1>{this.state.name}</h1>
            <Markdown source={this.state.description} skipHtml={true} />
            <hr/>
            <div className='light breaker'>@{uid}</div>
            {this.state.boards.map(n => {
              return <h6 className='light' key={uid + '/' + n.name}>
                <Link to={'/@' + uid + '/' + n.name}># {n.name}</Link>
              </h6>
            })}
          </div>)
        }
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
