import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import postReducer from './post'
import boardsReducer from './boards'
import openBoardReducer from './openboard'

export default combineReducers({
    router: routerReducer,
    postEditor: postReducer,
    boards: boardsReducer,
    openBoard: openBoardReducer
})