import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@material-ui/core';
import {
  ArrowLeft,
  Assignment,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/orbitdb';

export default function BoardsItem({
  address, metadata, name, closeBoard,
}) {
  return (
    <Card fluid>
      <CardHeader
        title={metadata.title || 'Unnamed board'}
        subheader="Board"
      />
      <Card.Content>
        <List>
          <ListItem>
            <ListItemIcon name="hashtag" verticalAlign="middle" />
            <ListItemText>
              <List.Header>Name</List.Header>
              <ListItemText>{name}</ListItemText>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon name="chain" verticalAlign="middle" />
            <ListItemText>
              <List.Header>Address</List.Header>
              <ListItemText>{address}</ListItemText>
            </ListItemText>
          </ListItem>
        </List>
      </Card.Content>
      <CardActions>
        <Button onClick={() => closeBoard(address)}>
          <ArrowLeft />
          {' '}
Close
        </Button>
        <Button as={Link} to={shortenAddress(address)}>
          <Assignment />
          {' '}
View
        </Button>
      </CardActions>
    </Card>
  );
}
