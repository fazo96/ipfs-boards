import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Board from '../containers/Board';
import BoardEditor from '../containers/BoardEditor';
import PostEditor from '../containers/PostEditor';
import WithStats from '../containers/WithStats';

function BoardPage({
  match, address, posts, metadata,
}) {
  return (
    <Switch>
      <Route path={`${match.path}p/new`} component={PostEditor} />
      <Route path={`${match.path}edit`} component={BoardEditor} />
      <Route path={match.path} component={WithStats(Board)} />
    </Switch>
  );
}

export default BoardPage;
