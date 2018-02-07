import React, { Component } from 'react'
import { connect } from 'react-redux'
import PostForm from '../components/PostForm'
import { addPost } from '../actions/post'
import { getBoardAddress } from '../utils/orbitdb';

class PostEditor extends Component {
    render() {
        const { post, addPost, match } = this.props
        const address = getBoardAddress(match.params.hash, match.params.name)
        return <PostForm post={post} onSave={p => addPost(address, p)} />
    }
}

function mapStateToProps(state){
    return {
        post: state.postEditor.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addPost: (address, post) => dispatch(addPost(address, post))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostEditor)