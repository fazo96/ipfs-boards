import React from 'react'
import { Card, Icon } from 'semantic-ui-react'

export default function Post({ title, multihash}) {
    return <Card fluid>
        <Card.Content>
            <Icon name="file text outline"/> {title}
        </Card.Content>
        <Card.Content style={{wordBreak:'break-all'}}>
            <Icon name="chain"/> <a href={'//ipfs.io/ipfs/'+multihash}>View</a>
        </Card.Content>
        <Card.Content extra>
            <Icon name="comments"/> Comments not supported yet
        </Card.Content>
    </Card>
}