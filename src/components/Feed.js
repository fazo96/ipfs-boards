import React from 'react'

export default function Feed({ posts }) {
    return <ul>{(posts || []).map(p => <li>{p}</li>)}</ul>
}