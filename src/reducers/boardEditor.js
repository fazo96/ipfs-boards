import {
    CREATE_BOARD,
    CREATING_BOARD,
    CREATED_BOARD
} from '../actions/actionTypes'

function getInitialState() {
    return {
        board: {
            title: ''
        },
        creating: false
    }
}

export default function BoardEditorReducer(state = getInitialState(), action) {
    switch (action.type) {
        case CREATE_BOARD:
            return Object.assign({}, state, { board: action.board, creating: false })
        case CREATING_BOARD:
            return Object.assign({}, state, { creating: true })
        case CREATED_BOARD:
            return Object.assign({}, state, { creating: false })
        default:
            return state
    }
}