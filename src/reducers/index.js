import { combineReducers } from 'redux'
import postReducer from './post'
import boardsReducer from './boards'

export default combineReducers({
    postEditor: postReducer,
    boards: boardsReducer
})