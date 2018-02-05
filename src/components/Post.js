import React from 'react'

export default function Post({ title, multihash}) {
    return <li>{title}: {multihash}</li>
}