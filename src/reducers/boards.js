import {
    OPENED_BOARD,
    UPDATE_BOARD,
    ORBITDB_REPLICATE_PROGRESS,
    ORBITDB_REPLICATED,
    ORBITDB_REPLICATE
} from '../actions/actionTypes'

function getInitialState() {
    return {
        boards: {}
    }
}

function updateBoard(existingBoards, address, value) {
    return Object.assign({}, existingBoards, {
        [address]: Object.assign({}, existingBoards[address] || {}, value)
    })
}

export default function BoardsReducer(state = getInitialState(), action) {
    let address
    switch (action.type) {
        case OPENED_BOARD:
            address = action.board.address
            return Object.assign({}, state, { boards: updateBoard(state.boards, address, action.board) })
        case UPDATE_BOARD:
            address = action.address
            let { posts, metadata } = action
            return Object.assign({}, state, { boards: updateBoard(state.boards, address, { posts, metadata })})
        case ORBITDB_REPLICATE:
            address = action.address
            return Object.assign({}, state, { boards: updateBoard(state.boards, address, {
                replicating: true
            })})
        case ORBITDB_REPLICATE_PROGRESS:
            address = action.address
            return Object.assign({}, state, { boards: updateBoard(state.boards, address, {
                replicating: true,
                replicationInfo: action.replicationInfo
            })})
        case ORBITDB_REPLICATED:
            address = action.address
            return Object.assign({}, state, { boards: updateBoard(state.boards, address, {
                replicating: false,
                lastReplicated: action.time
            })})
        default:
            return state;
    }
}