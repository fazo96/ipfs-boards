import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Feed from './Feed'
import PostEditor from '../containers/PostEditor'
import 'semantic-ui-css/semantic.css'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/post/new' component={PostEditor} />
        <Route path='/' component={Feed} />
      </Switch>
    );
  }
}

export default withRouter(App)
