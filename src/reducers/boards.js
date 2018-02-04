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
            const board = {
                id,
                posts: {
                    1: {
                        title: 'Example Post',
                        content: 'no, this is not real'
                    }
                }
            }
            const newBoards = Object.assign({}, state.boards.boards, { [id]: board })
            return Object.assign({}, state, { boards: newBoards })
        default:
            return state;
    }
}