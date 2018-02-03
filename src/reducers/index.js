import { combineReducers } from 'redux'
import postReducer from './post'

export default combineReducers({
    postEditor: postReducer
})