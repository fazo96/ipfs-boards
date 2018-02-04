import {
    CREATE_BOARD,
    CREATING_BOARD,
    CREATED_BOARD
} from './actionTypes'

export function createBoard(board) {
    return {
        type: CREATE_BOARD,
        board
    }
}

export function creatingBoard(board) {
    return {
        type: CREATING_BOARD,
        board
    }
}

export function createdBoard(board) {
    return {
        type: CREATED_BOARD,
        board
    }
}