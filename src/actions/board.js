import {
    OPEN_BOARD,
    OPENED_BOARD,
    BOARD_ERROR
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

export function boardError(error) {
    return {
        type: BOARD_ERROR,
        error
    }
}