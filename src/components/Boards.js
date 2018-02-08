import React from 'react'
import { List, Icon, Segment, Divider, Grid, Header, Button, Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import BoardsItem from './BoardsItem'

export default function Boards({ stats, boards, createBoard }) {
    return <Grid container divided colums={2}>
        <Grid.Column width={8}>
            <Header size='large' style={{marginTop:'.5em'}}>
                <Icon name="cube" color="blue" circular verticalAlign="middle" floated="right"/> 
                <Header.Content>
                    <Header.Content>IPFS Boards</Header.Content>
                    <Header.Subheader>Experimental Build</Header.Subheader>
                </Header.Content>
            </Header>
            <Divider />
            <List relaxed>
                <List.Item>
                    <List.Icon name='leaf' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Seeding</List.Header>
                        <List.Content>{Object.keys(boards).length} Boards</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='signal' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Connected Peers</List.Header>
                        <List.Content>{stats.peers.length}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='disk outline' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>Used Space</List.Header>
                        <List.Content>Not Supported Yet</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='user circle' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>IPFS ID</List.Header>
                        <List.Content>{stats.id}</List.Content>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='key' size="large" verticalAlign="middle"/>
                    <List.Content>
                        <List.Header>OrbitDB Public Key</List.Header>
                        <List.Content style={{wordBreak:'break-all'}}>{stats.pubKey}</List.Content>
                    </List.Content>
                </List.Item>
            </List>
            <div className="ui three buttons">
                <Button as='a' href="https://github.com/fazo96/ipfs-boards" target="__blank" >
                    <Icon name="github"/> GitHub
                </Button>
                <Button as={Link} to={'/b/new'}>
                    <Icon name="plus"/> Add Board
                </Button>
                <Button as='a' href="https://github.com/fazo96/ipfs-boards/issues/new" target="__blank">
                    <Icon name="comment"/> Leave Feedback
                </Button>
            </div>
        </Grid.Column>
        <Grid.Column width={8} style={{paddingTop:'3em'}}>
            <Card.Group className="centered">
                {Object.values(boards).map(board => <BoardsItem key={board.address} {...board} />)}
                {Object.keys(boards).length === 0 ? <Segment>No boards opened</Segment> : null}
            </Card.Group>
        </Grid.Column>
    </Grid>
}