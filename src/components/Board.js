import React from 'react'
import Post from './Post'
import { Segment, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Board({ id, posts }) {
    return <div>
        <Segment>{id}</Segment>
        <Segment><Button as={Link} to={'p/new'}>New Post</Button></Segment>
        <Segment>
            <ul>{Object.keys(posts).map(i => <Post key={posts[i].multihash} {...posts[i]}/>)}</ul>
        </Segment>
    </div>
}