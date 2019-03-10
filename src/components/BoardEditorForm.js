import React, { Component } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import {
  Save,
  ArrowLeft,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/orbitdb';

export default class BoardEditorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title || '',
      website: props.website || '',
      email: props.email || '',
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  }

  render() {
    const { title, website, email } = this.state;
    const { address, updateBoardMetadata } = this.props;
    return (
      <Card fluid centered style={{ marginTop: '5em', maxWidth: '40em' }}>
        <CardHeader>Edit Board</CardHeader>
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
          <TextField
            label="Title"
            value={title}
            onChange={this.handleChange('title')}
          />
          <TextField
            label="Website"
            value={website}
            onChange={this.handleChange('website')}
          />
          <TextField
            label="Email"
            value={email}
            type="email"
            onChange={this.handleChange('email')}
          />
        </CardContent>
        <CardActions>
          <Button as={Link} to={shortenAddress(address)}>
            <ArrowLeft />
            {' '}
Back
          </Button>
          <Button type="submit" onClick={() => updateBoardMetadata(address, this.state)}>
            <Save />
            {' '}
Save
          </Button>
        </CardActions>
      </Card>
    );
  }
}
