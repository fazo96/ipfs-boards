import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Board from '../containers/Board'
import PostEditor from '../containers/PostEditor'

function BoardPage({ match, address, posts, metadata }) {
    return <Switch>
        <Route path={match.path+'p/new'} component={PostEditor} /> 
        <Route path={match.path} component={Board} />
    </Switch>
}

export default BoardPage