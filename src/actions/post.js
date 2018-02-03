import { ADD_POST } from './actionTypes'

export function addPost(post) {
    return {
        type: ADD_POST,
        post
    }
}