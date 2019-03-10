import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
} from '@material-ui/core';
import {
  AccountBox,
  CastConnected,
  Wifi,
  Usb,
  VerifiedUser,
  Lock,
  Code,
  Add,
  Comment,
} from '@material-ui/icons';
import BoardsItem from './BoardsItem';

export default function Boards({
  stats, boards, createBoard, closeBoard,
}) {
  return (
    <Grid>
      <Grid item xs="12" md="8">
        <Card>
          <CardHeader
            avatar={<Avatar><AccountBox /></Avatar>}
            title="IPFS Boards"
            subheader="Experimental Build"
          />
          <CardContent>
            <List>
              <ListItem>
                <ListItemIcon><CastConnected /></ListItemIcon>
                <ListItemText
                  primary={Object.keys(boards).length}
                  secondary="Seeding"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Wifi /></ListItemIcon>
                <ListItemText
                  primary={stats.peers.length}
                  secondary="Connected Peers"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Usb /></ListItemIcon>
                <ListItemText
                  primary="Not supported yet"
                  secondary="Used Space"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><VerifiedUser /></ListItemIcon>
                <ListItemText
                  primary={stats.id}
                  secondary="IPFS ID"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Lock /></ListItemIcon>
                <ListItemText
                  primary={stats.pubKey}
                  secondary="OrbitDB Public Key"
                />
              </ListItem>
            </List>
          </CardContent>
          <CardActions>
            <Button as="a" href="https://github.com/fazo96/ipfs-boards" target="__blank">
              <Code />
              {' '}
GitHub
            </Button>
            <Button as={Link} to="/b/new">
              <Add />
              {' '}
Add Board
            </Button>
            <Button as="a" href="https://github.com/fazo96/ipfs-boards/issues/new" target="__blank">
              <Comment />
              {' '}
Leave Feedback
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        {Object.values(boards).map(board => <BoardsItem key={board.address} closeBoard={closeBoard} {...board} />)}
        {Object.keys(boards).length === 0 && 'No boards opened'}
      </Grid>
    </Grid>
  );
}
