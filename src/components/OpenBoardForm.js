import React, { Component } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
} from '@material-ui/core';
import {
  Add,
  ArrowLeft,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';

export default class OpenBoardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address || '',
    };
  }

  updateAddress = (event) => {
    const address = event.target.value;
    this.setState({ address });
  }

  render() {
    const { address } = this.state;
    const { openBoard, opening } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <Card>
          <CardHeader
            title="Open a Board"
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
            <TextField
              placeholder="Paste an existing address or write your new board ID"
              value={address}
              onChange={this.updateAddress}
              disabled={opening}
            />
          </CardContent>
          <CardActions>
            <Button component={Link} to="/">
              <ArrowLeft />
              {' '}
Back
            </Button>
            <Button type="submit" disabled={opening} onClick={() => openBoard({ address, redirect: true })}>
              <Add />
              {' '}
Open
            </Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}
