import {
    OPEN_BOARD,
    OPENED_BOARD
} from '../actions/actionTypes'

function getInitialState() {
    return {
        opening: false
    }
}

export default function openBoardReducer(state = getInitialState(), action) {
    switch (action.type) {
        case OPEN_BOARD:
            return Object.assign({}, state, { opening: true })
        case OPENED_BOARD:
            return Object.assign({}, state, { opening: false })
        default:
            return state
    }
}