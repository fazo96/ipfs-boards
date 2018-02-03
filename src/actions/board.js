import { CREATE_BOARD } from './actionTypes'

export function createBoard(board) {
    return {
        type: CREATE_BOARD,
        board
    }
}