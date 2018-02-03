import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Feed from './Feed'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/' component={Feed} />
      </Switch>
    );
  }
}

export default App;
