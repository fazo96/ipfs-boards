import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostForm from '../components/PostForm'
import { addPost } from '../actions/post'

class PostEditor extends Component {
    render() {
        const { post, addPost, match } = this.props
        const { boardId } = match.params
        return <PostForm post={post} onSave={p => addPost(boardId, p)} />
    }
}

function mapStateToProps(state){
    return {
        post: state.postEditor.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addPost: (boardId, post) => dispatch(addPost(boardId, post))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostEditor)