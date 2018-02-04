import React from 'react'
import PostEditor from '../containers/PostEditor'
import Post from './Post'
import { Segment } from 'semantic-ui-react'

export default function Board({ id, posts }) {
    return <div>
        <Segment>{id}</Segment>
        <Segment>
            <PostEditor />
        </Segment>
        <Segment>
            <ul>{Object.keys(posts).map(i => <Post key={posts[i]} {...posts[i]}/>)}</ul>
        </Segment>
    </div>
}