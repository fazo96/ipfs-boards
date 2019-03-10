import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Comment, Link as LinkIcon } from '@material-ui/icons';

export default function Post({ title, multihash, pubKey }) {
  return (
    <Card>
      <CardHeader
        title={title}
        subheader="Post"
      />
      <CardContent style={{ wordBreak: 'break-all' }}>
        <List>
          <ListItem>
            <ListItemIcon name="key" verticalAlign="middle" />
            <ListItemText
              primary={pubKey || 'Unknown'}
              secondary="Signed By"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Comment /></ListItemIcon>
            <ListItemText
              primary="Not supported yet"
              secondary="Comments"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><LinkIcon /></ListItemIcon>
            <ListItemText
              primary={<a href={`//ipfs.io/ipfs/${multihash}`}>{multihash}</a>}
              secondary="Content"
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}
