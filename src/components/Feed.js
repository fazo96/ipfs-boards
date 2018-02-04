import React from 'react'
import { PostEditor } from '../containers/PostEditor'
import { Section } from 'react-semantic-ui'

export default function Board({ posts }) {
    return <div>
        <Section>
            <PostEditor />
        </Section>
        <Section>
            <ul>{(posts || []).map(p => <li>{p}</li>)}</ul>
        </Section>
    </div>
}