import React from 'react'
import { List } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function BoardsItem({ id, title }) {
    return <List.Item as={Link} to={'/b/'+id+'/'}>
        <List.Icon name='comments' size='large' verticalAlign='middle' />
        <List.Content>
            <List.Header>{title}</List.Header>
            <List.Description>Experimental</List.Description>
        </List.Content>
    </List.Item>
}