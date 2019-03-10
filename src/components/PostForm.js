import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Button,
} from '@material-ui/core';
import {
  Link as LinkIcon,
  Save,
  ArrowLeft,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/orbitdb';

export default class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || '',
      content: props.content || '',
    };
  }

  updateTitle(event) {
    this.setState({ title: event.target.value });
  }

  updateContent(event) {
    this.setState({ content: event.target.value });
  }

  render() {
    const { title, content } = this.state;
    const { onSave, board } = this.props;
    const { address } = board;
    return (
      <div style={{ display: 'flex' }}>
        <Card fluid centered style={{ marginTop: '5em', maxWidth: '40em' }}>
          <CardHeader
            title="New Post"
          />
          <CardContent>
              Boards is an experimental peer to peer application.
            <br />
              All content you publish will be public and may be lost or
              changed at any time.
            <br />
              Please do not use this version of Boards
              for anything other than testing purposes
          </CardContent>
          <CardContent>
            <LinkIcon />
            {' '}
            {address}
          </CardContent>
          <CardContent>
            <TextField
              label="Title"
              placeholder="What's this about?"
              value={title}
              onChange={this.updateTitle}
            />
            <TextField
              label="Content"
              placeholder="Write your thoughts"
              value={content}
              onChange={this.updateContent}
            />
          </CardContent>
          <CardActions>
            <Button as={Link} to={shortenAddress(address)}>
              <ArrowLeft />
              {' '}
Board
            </Button>
            <Button type="submit" onClick={() => onSave({ title, text: content })}>
              <Save />
              {' '}
Submit
            </Button>

          </CardActions>
        </Card>
      </div>
    );
  }
}
