import { ADD_POST } from './actionTypes'

export function addPost(boardId, post) {
    return {
        type: ADD_POST,
        post,
        boardId
    }
}