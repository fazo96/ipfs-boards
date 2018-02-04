import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom'
import Boards from '../containers/Boards'
import PostEditor from '../containers/PostEditor'
import BoardEditor from '../containers/BoardEditor'
import Board from '../containers/Board'
import 'semantic-ui-css/semantic.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/b/new' component={BoardEditor} />
        <Route path='/b/:boardId/p/new' component={PostEditor} /> 
        <Route path='/b/:boardId' component={Board} />
        <Route path='/' component={Boards} />
      </Switch>
    )
  }
}

export default withRouter(App)
