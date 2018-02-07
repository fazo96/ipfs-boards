import {
    OPEN_BOARD,
    OPENED_BOARD
} from '../actions/actionTypes'

function getInitialState() {
    return {
        board: {
            name: ''
        },
        creating: false
    }
}

export default function BoardEditorReducer(state = getInitialState(), action) {
    switch (action.type) {
        case OPEN_BOARD:
            return Object.assign({}, state, { board: action.board, opening: true })
        case OPENED_BOARD:
            return Object.assign({}, state, { opening: false, board: action.board })
        default:
            return state
    }
}