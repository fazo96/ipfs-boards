var React = require('react')
var Markdown = require('markdown.jsx')
var Link = require('react-router').Link
var Icon = require('icon.jsx')

module.exports = function(boards){
  return React.createClass({
    getInitialState: function(){
      return { name: '...', boards: [] }
    },
    componentDidMount: function(){
      console.log('About to ask for profile for',this.props.params.userid)
      var ee = boards.getEventEmitter()
      ee.on('boards for '+this.props.params.userid,l => {
        if(!this.isMounted()) return true
        this.setState({ boards: l })
      })
      boards.getProfile(this.props.params.userid,(err,res) => {
        if(!this.isMounted()) return true
        if(err){
          this.setState({
            name: <Icon name="ban" />,
            description: err
          })
        } else {
          this.setState({ name: res.name, description: res.description })
        }
      })
    },
    linkToEditor: function(){
      if(this.props.params.userid === boards.id){
        return <div>
          <h6>This is your profile</h6>
          <hr/>
        </div>
      }
      return ''
    },
    render: function(){
      return (<div className="profile">
        {this.linkToEditor()}
        <h1>{this.state.name}</h1>
        <Markdown source={this.state.description} skipHtml={true} />
        <hr/>
        <h5 className="light">@{this.props.params.userid}</h5>
        {this.state.boards.map(n => {
          return <h6 className="light" key={this.props.params.userid+'/'+n.name}>
            <Link to={'/@'+this.props.params.userid+'/'+n.name}># {n.name}</Link>
          </h6>
        })}
      </div>)
    }
  })
}
