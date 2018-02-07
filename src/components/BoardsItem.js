import React from 'react'
import { Button, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb'

export default function BoardsItem({ address, title }) {
    return <Card fluid>
        <Card.Content>
            <Card.Header>
                { title || 'Unnamed board' }
            </Card.Header>
            <Card.Meta>
                Board
            </Card.Meta>
            </Card.Content>
            <Card.Content>
            <Card.Description style={{wordBreak:'break-all'}}>
                {address}
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <Button as={Link} to={shortenAddress(address)} basic fluid>View</Button>
        </Card.Content>
    </Card>
}