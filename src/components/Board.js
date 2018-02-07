import React from 'react'
import Post from './Post'
import { Segment, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb';

export default function Board({ address, posts }) {
    return <div>
        <Segment>{address}</Segment>
        <Segment><Button as={Link} to={shortenAddress(address)+'/p/new'}>New Post</Button></Segment>
        <Segment>
            <ul>{Object.keys(posts || {}).map(i => <Post key={posts[i].multihash} {...posts[i]}/>)}</ul>
        </Segment>
    </div>
}