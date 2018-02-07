import { OPENED_BOARD, UPDATE_BOARD } from '../actions/actionTypes'
import { getBoardIdFromAddress } from '../utils/orbitdb'

function getInitialState() {
    return {
        boards: {}
    }
}

export default function BoardsReducer(state = getInitialState(), action) {
    let address, newBoards
    switch (action.type) {
        case OPENED_BOARD:
            address = action.board.address
            newBoards = Object.assign({}, state.boards, { [address]: action.board })
            return Object.assign({}, state, { boards: newBoards })
        case UPDATE_BOARD:
            address = action.address
            let { posts, metadata } = action
            newBoards = Object.assign({}, state.boards, {
                [address]: Object.assign({}, state.boards[address], { posts, metadata })
            })
            return Object.assign({}, state, { boards: newBoards })
        default:
            return state;
    }
}