import React from 'react'

export default function Post({ title, content }) {
    return <li>{title}: {content}</li>
}