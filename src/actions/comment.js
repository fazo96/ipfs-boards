import { HIDE_COMMENT, ADD_COMMENT, EDIT_COMMENT } from './actionTypes';

export function addComment(address, postId, comment, replyTo = 'post') {
  return {
    type: ADD_COMMENT,
    address,
    postId,
    comment,
    replyTo,
  };
}

export function editComment(address, postId, commentId, comment, replyTo = 'post') {
  return {
    type: EDIT_COMMENT,
    address,
    postId,
    commentId,
    comment,
    replyTo,
  };
}

export function hideComment(address, postId, commentId, replyTo = 'post') {
  return {
    type: HIDE_COMMENT,
    address,
    postId,
    commentId,
    replyTo,
  };
}
