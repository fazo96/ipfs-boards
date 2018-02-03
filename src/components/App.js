import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Boards from '../containers/Boards'
import PostEditor from '../containers/PostEditor'
import 'semantic-ui-css/semantic.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/p/new' component={PostEditor} />
        <Route path='/' component={Boards} />
      </Switch>
    );
  }
}

export default withRouter(App)
