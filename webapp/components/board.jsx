var React = require('react')
var Markdown = require('markdown.jsx')
var Link = require('react-router').Link
var Icon = require('icon.jsx')

module.exports = function(boardsAPI){
  var UserID = require('userID.jsx')(boardsAPI)
  var PostList = require('postlist.jsx')(boardsAPI)
  var GetIPFS = require('getipfs.jsx')(boardsAPI)
  return React.createClass({
    getInitialState: function(){
      return { name: this.props.params.boardname, api: false }
    },
    componentDidMount: function(){
      boardsAPI.use(boards => {
        /*
        When a component inside the component being rendered by the router also needs
        access to the boards api, it appears unitialized and never initializes to it
        for no apparent reason. Calling init twice (one automgically and one
        when the root component mounts) works as a cheap, horrible workaround
        */
        boards.init()
        if(!this.isMounted()) return
        var ee = boards.getEventEmitter()
        ee.on('init',err => {
          if(!err && this.isMounted()){
            this.setState({ api: true })
            this.init(boards)
          }
        })
        if(this.props.params.userid){
          ee.on('settings for '+this.props.params.boardname+'@'+this.props.params.userid, (res) => {
            if(!this.isMounted()) return true
            if(res) this.setState({ name: res.fullname, description: res.description })
          })
        } else {
          this.setState({ description: 'All the messages posted in __#'+this.props.params.boardname+'__' })
        }
        if(boards.isInit || this.state.api){
          this.setState({api: true})
          this.init(boards)
        }
      })
    },
    init: function(boards){
      if(!this.state.init){
        if(this.props.params.userid)
          boards.getBoardSettings(this.props.params.userid,this.props.params.boardname)
        this.setState({ init: true })
      }
    },
    render: function(){
      if(this.state.api){
        return (<div className="board">
          <h2>{this.state.name}</h2>
          <Markdown source={this.state.description} skipHtml={true} />
          {this.props.params.userid?<h5><UserID id={this.props.params.userid} /></h5>:<p></p>}
          <hr />
          <PostList board={this.props.params.boardname} admin={this.props.params.userid}/>
        </div>)
      } else return <GetIPFS />
    }
  })
}
