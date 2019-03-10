import React from 'react';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  CardActions,
} from '@material-ui/core';
import {
  Add,
  Link as LinkIcon,
  Usb,
  NetworkCell,
  NetworkCheck,
  CloudDownload,
  Edit,
  Assignment,
  Mail,
  ArrowLeft,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { shortenAddress } from '../utils/orbitdb';
import Post from './Post';

export default function Board({
  address, posts, metadata, replicating, stats, replicationInfo, lastReplicated,
}) {
  const {
    email, website, title, description,
  } = metadata || {};
  const peerCount = (stats.peers || []).length;
  const online = peerCount > 0;
  const writeable = stats.access ? (stats.access.writeable ? 'Yes' : 'No') : '?';
  let replicationMessage = lastReplicated ? (`Last Activity at ${moment(lastReplicated).format('H:mm')}`) : 'No Activity';
  if (replicating) {
    if (replicationInfo && replicationInfo.max !== undefined) {
      replicationMessage = `Progress: ${replicationInfo.progress || 0}/${replicationInfo.max}`;
    } else {
      replicationMessage = 'Initializing Transfer';
    }
  }
  return (
    <Grid container>
      <Grid item xs="12" md="6">
        <Card>
          <CardHeader
            title={title || 'Unnamed Board'}
            subheader="Board"
          />
        </Card>
        <CardContent>
          { description ? <p>{description}</p> : null }
        </CardContent>
        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon><LinkIcon /></ListItemIcon>
              <ListItemText
                primary={address}
                secondary="Address"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Usb /></ListItemIcon>
              <ListItemText
                primary={`${stats.opLogLength || 0} Entries`}
                secondary="Size"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><NetworkCell /></ListItemIcon>
              <ListItemText
                primary={online ? `${peerCount} Connections` : 'No Connections'}
                secondary={online ? 'Online' : 'Offline'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><CloudDownload /></ListItemIcon>
              <ListItemText
                primary={replicationMessage}
                secondary={replicating ? 'Downloading' : 'Download'}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Edit /></ListItemIcon>
              <ListItemText
                primary={writeable}
                secondary="Write Access"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><Assignment /></ListItemIcon>
              <ListItemText
                primary={Object.values(posts || {}).length}
                secondary="Posts"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><NetworkCheck /></ListItemIcon>
              <ListItemText
                primary={website ? <a href={website} target="__blank">{website}</a> : 'N/A'}
                secondary="Website"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Mail /></ListItemIcon>
              <ListItemText
                primary={email ? <a href={`mailto:${email}`}>{email}</a> : 'N/A'}
                secondary="Email"
              />
            </ListItem>
          </List>
        </CardContent>
        <CardActions>
          <Button as={Link} to="/">
            <ArrowLeft />
            {' '}
Boards
          </Button>
          <Button disabled={!writeable} as={Link} to={`${shortenAddress(address)}/edit`}>
            <Edit />
            {' '}
Edit
          </Button>
          <Button disabled={!writeable} as={Link} to={`${shortenAddress(address)}/p/new`}>
            <Add />
            {' '}
New Post
          </Button>
        </CardActions>
      </Grid>
      <Grid xs="12" md="6">
        {Object.keys(posts || {}).map(i => <Post key={posts[i].multihash} {...posts[i]} />)}
      </Grid>
    </Grid>
  );
}
