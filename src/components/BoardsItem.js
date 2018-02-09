import React from 'react'
import { List, Button, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb'

export default function BoardsItem({ address, metadata, name }) {
    return <Card fluid>
        <Card.Content>
            <Card.Header>
                { metadata.title || 'Unnamed board' }
            </Card.Header>
            <Card.Meta>Board</Card.Meta>
        </Card.Content>
        <Card.Content>
            <List>
                <List.Item>
                    <List.Icon name="hashtag" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Name</List.Header>
                        <List.Content>{name}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name="chain" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Address</List.Header>
                        <List.Content>{address}</List.Content>
                    </List.Content>
                </List.Item>
            </List>
        </Card.Content>
        <Card.Content extra>
            <Button as={Link} to={shortenAddress(address)} basic fluid>View</Button>
        </Card.Content>
    </Card>
}