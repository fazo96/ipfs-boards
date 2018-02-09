import {
    OPEN_BOARD,
    OPENED_BOARD,
    UPDATE_BOARD_METADATA
} from './actionTypes'

export function openBoard(board) {
    return {
        type: OPEN_BOARD,
        board
    }
}

export function createdBoard(board) {
    return {
        type: OPENED_BOARD,
        board
    }
}

export function updateBoardMetadata(address, metadata) {
    return {
        type: UPDATE_BOARD_METADATA,
        address,
        metadata 
    }
}