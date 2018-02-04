import React from 'react'
import { List } from 'semantic-ui-react'

export default function BoardsItem({ title }) {
    return <List.Item>
        <List.Icon name='comments' size='large' verticalAlign='middle' />
        <List.Content>
            <List.Header>{title}</List.Header>
            <List.Description>Experimental</List.Description>
        </List.Content>
    </List.Item>
}