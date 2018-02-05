import { CREATED_BOARD, UPDATE_BOARD } from '../actions/actionTypes'
import { getBoardIdFromAddress } from '../utils/orbitdb'

function getInitialState() {
    return {
        boards: {}
    }
}

export default function BoardsReducer(state = getInitialState(), action) {
    let id, newBoards
    switch (action.type) {
        case CREATED_BOARD:
            id = getBoardIdFromAddress(action.board.address)
            const board = {
                id,
                posts: {}
            }
            newBoards = Object.assign({}, state.boards, { [id]: board })
            return Object.assign({}, state, { boards: newBoards })
        case UPDATE_BOARD:
            id = action.boardId
            let { posts } = action
            console.log(state, action)
            newBoards = Object.assign({}, state.boards, {
                [id]: Object.assign({}, state.boards[id], { posts })
            })
            return Object.assign({}, state, { boards: newBoards })
        default:
            return state;
    }
}