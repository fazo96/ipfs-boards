import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Boards from '../containers/Boards';
import OpenBoard from '../containers/OpenBoard';
import WithBoard from '../containers/WithBoard';
import BoardPage from './BoardPage';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/b/new" component={OpenBoard} />
        <Route path="/b/:hash/:name/" component={withRouter(WithBoard(BoardPage))} />
        <Route path="/" component={Boards} />
      </Switch>
    );
  }
}

export default withRouter(App);
