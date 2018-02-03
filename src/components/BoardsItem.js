import React from 'react'
import { List } from 'semantic-ui-react'

export default function BoardsItem(props) {
    return <List.Item>
        <List.Icon name='board' size='large' verticalAlign='middle' />
        <List.Content>
            <List.Header>Board Name</List.Header>
            <List.Description>Updated 10 mins ago</List.Description>
        </List.Content>
    </List.Item>
}