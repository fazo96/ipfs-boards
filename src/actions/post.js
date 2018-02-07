import { ADD_POST } from './actionTypes'

export function addPost(address, post) {
    return {
        type: ADD_POST,
        post,
        address 
    }
}