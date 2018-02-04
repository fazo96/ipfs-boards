import { CREATED_BOARD } from '../actions/actionTypes'

function getInitialState() {
    return {
        boards: []
    }
}

export default function BoardsReducer(state = getInitialState(), action) {
    switch (action.type) {
        case CREATED_BOARD:
            return Object.assign({}, state, { boards: state.boards.concat(action.board) })
        default:
            return state;
    }
}