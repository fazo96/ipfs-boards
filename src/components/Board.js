import React from 'react'
import Post from './Post'
import { Divider, Icon, Grid, Segment, Header, List, Button, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb';

export default function Board({ address, posts, metadata }) {
    const { email, website, title } = metadata || {}
    const url = window.location.href
    return <Grid container divided colums={2}>
        <Grid.Column width={8}>
            <Header size='large' style={{marginTop:'.5em'}}>
                <Header.Content>{title || 'Unnamed Board'}</Header.Content>
                <Header.Subheader>Board</Header.Subheader>
            </Header>
            <Divider />
            <List relaxed>
                <List.Item>
                    <List.Icon name='linkify' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Board Address</List.Header>
                        <List.Content>
                            <a href={url}>{address}</a>
                        </List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='users' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Users</List.Header>
                        <List.Content>?</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='file text outline' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Posts</List.Header>
                        <List.Content>{Object.values(posts || {}).length}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='wifi' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Replication Status</List.Header>
                        <List.Content>Idle</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='globe' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Website</List.Header>
                        <List.Content>{website ? <a href={website}>{website}</a> : 'N/A'}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='mail' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Mail</List.Header>
                        <List.Content>{email ? <a href={'mailto:'+email}>{email}</a> : 'N/A'}</List.Content>
                    </List.Content>
                </List.Item>
            </List>
            <div className='ui two buttons'>
                <Button>Edit</Button>
                <Button as={Link} to={shortenAddress(address)+'/p/new'}>New Post</Button>
            </div>
        </Grid.Column>
        <Grid.Column width={8}>
            <Card.Group className="centered" style={{marginTop:'.5em'}}>
                {Object.keys(posts || {}).map(i => <Post key={posts[i].multihash} {...posts[i]}/>)}
            </Card.Group>
        </Grid.Column>
    </Grid>
}