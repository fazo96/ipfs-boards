import React from 'react'
import Post from './Post'
import { Divider, Icon, Grid, Header, List, Button, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { shortenAddress } from '../utils/orbitdb';
import moment from 'moment'

export default function Board({ address, posts, metadata, replicating, stats, replicationInfo, lastReplicated }) {
    const { email, website, title } = metadata || {}
    const peerCount = (stats.peers || []).length
    const online = peerCount > 0
    const writeable = stats.access ? (stats.access.writeable ? 'Yes' : 'No') : '?'
    let replicationMessage = lastReplicated ? ('Last Activity at ' + moment(lastReplicated).format('H:mm')) : 'No Activity'
    if (replicating) {
        if (replicationInfo && replicationInfo.max !== undefined) {
            replicationMessage = 'Progress: ' + (replicationInfo.progress || 0) + '/' + replicationInfo.max
        } else {
            replicationMessage = 'Initializing Transfer'
        }
    }
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
                        <List.Header>Address</List.Header>
                        <List.Content>
                            {address}
                        </List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='disk outline' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Size</List.Header>
                        <List.Content>{stats.opLogLength || 0} Entries</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name={online ? 'heart' : 'heartbeat'} size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>{online ? 'Online' : 'Offline'}</List.Header>
                        <List.Content>{online ? peerCount + ' Connections' : 'No Connections'}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon color={replicating ? 'green' : null} name='feed' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>{replicating ? 'Downloading' : 'Download'}</List.Header>
                        <List.Content>{replicationMessage}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='edit' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Write Access</List.Header>
                        <List.Content>{writeable}</List.Content>
                    </List.Content>
                </List.Item>
                <Divider/>
                <List.Item>
                    <List.Icon name='file text outline' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Posts</List.Header>
                        <List.Content>{Object.values(posts || {}).length}</List.Content>
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
            <div className='ui three buttons basic'>
                <Button as={Link} to={'/'}>
                    <Icon name='left arrow'/> Boards
                </Button>
                <Button disabled={!writeable} as={Link} to={shortenAddress(address)+'/edit'}>
                    <Icon name='pencil'/> Edit
                </Button>
                <Button disabled={!writeable} as={Link} to={shortenAddress(address)+'/p/new'}>
                    <Icon name='plus'/> New Post
                </Button>
            </div>
        </Grid.Column>
        <Grid.Column width={8}>
            <Card.Group className="centered" style={{marginTop:'.5em'}}>
                {Object.keys(posts || {}).map(i => <Post key={posts[i].multihash} {...posts[i]}/>)}
            </Card.Group>
        </Grid.Column>
    </Grid>
}