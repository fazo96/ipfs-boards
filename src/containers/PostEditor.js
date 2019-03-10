import React, { Component } from 'react';
import { connect } from 'react-redux';
import PostForm from '../components/PostForm';
import { addPost } from '../actions/post';
import { getBoardAddress } from '../utils/orbitdb';

class PostEditor extends Component {
  render() {
    const {
      post, addPost, match, boards,
    } = this.props;
    const address = getBoardAddress(match.params.hash, match.params.name);
    const board = boards[address];
    return <PostForm post={post} board={board} onSave={p => addPost(address, p)} />;
  }
}

function mapStateToProps(state) {
  return {
    post: state.postEditor.post,
    boards: state.boards.boards,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addPost: (address, post) => dispatch(addPost(address, post)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostEditor);
