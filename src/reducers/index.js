import { combineReducers } from 'redux'
import { connectRouter} from 'connected-react-router'
import postReducer from './post'
import boardsReducer from './boards'
import openBoardReducer from './openboard'

export default history => combineReducers({
    router: connectRouter(history),
    postEditor: postReducer,
    boards: boardsReducer,
    openBoard: openBoardReducer
})