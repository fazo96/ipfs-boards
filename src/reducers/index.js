import { combineReducers } from 'redux'
import postReducer from './post'
import boardsReducer from './boards'
import boardEditorReducer from './boardEditor'

export default combineReducers({
    postEditor: postReducer,
    boards: boardsReducer,
    boardEditor: boardEditorReducer
})