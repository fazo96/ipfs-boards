var React = require('react')
var Markdown = require('markdown.jsx')
var Link = require('react-router').Link
var Icon = require('icon.jsx')
var GetIPFS = require('getipfs.jsx')

module.exports = function (boardsAPI) {
  return React.createClass({
    getInitialState: function () {
      return { name: '...', boards: [], api: false }
    },
    componentDidMount: function () {
      boardsAPI.use(boards => {
        if (boards.isInit) {
          this.setState({ api: boards, id: boards.id })
          this.init(boards)
        }
        var ee = boards.getEventEmitter()
        ee.on('init', err => {
          if (!err && this.isMounted()) {
            this.setState({ api: boards, id: boards.id })
            this.init(boards)
          }
        })
      })
    },
    componentWillReceiveProps: function (nextProps) {
      boardsAPI.use(boards => this.downloadProfile(boards, nextProps))
    },
    downloadProfile: function (boards, props) {
      var ee = boards.getEventEmitter()
      var uid = props.params.userid
      if (uid === 'me') uid = boards.id
      ee.on('boards for ' + uid, l => {
        var u2id = props.params.userid
        if (u2id === 'me') u2id = boards.id
        if (!this.isMounted() || u2id !== uid) return true
        this.setState({ boards: l })
      })
      boards.getProfile(uid, (err, res) => {
        if (!this.isMounted()) return true
        if (err) {
          this.setState({
            name: <Icon name="ban" />,
            description: err
          })
        } else {
          this.setState({ name: res.name, description: res.description })
        }
      })
    },
    init: function (boards) {
      if (this.state.init) return
      if (boards.isInit || this.state.api) {
        this.downloadProfile(boards, this.props)
        this.setState({ init: true })
      }
    },
    linkToEditor: function () {
      var uid = this.props.params.userid
      if (uid === 'me' && this.state.id) uid = this.state.id
      if (uid === this.state.id) {
        return <div>
          <h6>This is your profile</h6>
          <hr/>
        </div>
      }
      return ''
    },
    render: function () {
      if (this.state.api) {
        var uid = this.props.params.userid
        if (uid === 'me') uid = this.state.id
        return (<div className="profile">
          {this.linkToEditor()}
          <h1>{this.state.name}</h1>
          <Markdown source={this.state.description} skipHtml={true} />
          <hr/>
          <div className="light breaker">@{uid}</div>
          {this.state.boards.map(n => {
            return <h6 className="light" key={uid + '/' + n.name}>
              <Link to={'/@' + uid + '/' + n.name}># {n.name}</Link>
            </h6>
          })}
        </div>)
      } else return <GetIPFS api={this.state.api} />
    }
  })
}
