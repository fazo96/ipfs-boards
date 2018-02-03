import { CREATE_BOARD } from '../actions/actionTypes'

function getInitialState() {
    return {
        board: {
            title: ''
        }
    }
}

export default function BoardEditorReducer(state = getInitialState(), action) {
    switch (action.type) {
        case CREATE_BOARD:
            return Object.assign({}, state, { board: action.board })
        default:
            return state
    }
}