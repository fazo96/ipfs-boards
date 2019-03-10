import { ADD_POST, EDIT_POST, HIDE_POST } from './actionTypes';

export function addPost(address, post) {
  return {
    type: ADD_POST,
    post,
    address,
  };
}

export function editPost(address, postId, post) {
  return {
    type: EDIT_POST,
    address,
    postId,
    post,
  };
}

export function hidePost(address, postId) {
  return {
    type: HIDE_POST,
    address,
    postId,
  };
}
