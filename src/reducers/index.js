import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import postReducer from './post'
import boardsReducer from './boards'
import boardEditorReducer from './boardEditor'

export default combineReducers({
    router: routerReducer,
    postEditor: postReducer,
    boards: boardsReducer,
    boardEditor: boardEditorReducer
})