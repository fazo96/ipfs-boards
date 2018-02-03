import React from 'react'
import { connect } from 'react-redux'
import PostForm from '../components/PostForm'
import { addPost } from '../actions/post'

function PostEditor({ post, addPost }) {
    return <PostForm post={post} onSave={addPost} />
}

function mapStateToProps(state){
    return {
        post: state.postEditor.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addPost: post => dispatch(addPost(post))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostEditor)