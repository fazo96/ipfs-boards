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
        ee.on('settings for '+this.props.params.boardname+'@'+this.props.params.userid, (res) => {
          if(!this.isMounted()) return true
          console.log('Found name:',res.fullname)
          this.setState({ name: res.fullname.trim(), description: res.description })
        })
        if(boards.isInit || this.state.api){
          this.setState({api: true})
          this.init(boards)
          boards.getBoardSettings(this.props.params.userid,this.props.params.boardname)
        }
      })
    },
    init: function(boards){
      if(!this.state.init){
        boards.getBoardSettings(this.props.params.userid,this.props.params.boardname)
        this.setState({ init: true })
      }
    },
    render: function(){
      if(this.state.api){
        return (<div className="board">
          <h2>{this.state.name}</h2>
          <Markdown source={this.state.description} skipHtml={true} />
          <h5><UserID id={this.props.params.userid} /></h5>
          <PostList board={this.props.params.boardname} admin={this.props.params.userid}/>
        </div>)
      } else return <GetIPFS />
    }
  })
}
