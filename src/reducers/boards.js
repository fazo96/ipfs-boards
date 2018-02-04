import { CREATED_BOARD } from '../actions/actionTypes'
import { getBoardIdFromAddress } from '../utils/orbitdb'

function getInitialState() {
    return {
        boards: []
    }
}

export default function BoardsReducer(state = getInitialState(), action) {
    switch (action.type) {
        case CREATED_BOARD:
            const id = getBoardIdFromAddress(action.board.address)
            const newBoards = Object.assign({}, state.boards.boards, { [id]: action.board })
            return Object.assign({}, state, { boards: newBoards })
        default:
            return state;
    }
}