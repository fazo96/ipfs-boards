import React from 'react'
import { List, Card } from 'semantic-ui-react'

export default function Post({ title, multihash, pubKey }) {
    return <Card fluid>
        <Card.Content>
            <Card.Header>
                {title}
            </Card.Header>
            <Card.Meta>Post</Card.Meta>
        </Card.Content>
        <Card.Content style={{wordBreak:'break-all'}}>
            <List>
                <List.Item>
                    <List.Icon name="key" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Signed By</List.Header>
                        <List.Content>{pubKey || 'Unknown'}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name="comments" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Comments</List.Header>
                        <List.Content>Not Supported Yet</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name="chain" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Content</List.Header>
                        <List.Content>
                            <a href={'//ipfs.io/ipfs/'+multihash}>{multihash}</a>
                        </List.Content>
                    </List.Content>
                </List.Item>
            </List>
        </Card.Content>
    </Card>
}