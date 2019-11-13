import React, { useState } from 'react'
import { Card, CardContent, TextField, Button, Typography, Divider} from '@material-ui/core'
import OpenIcon from '@material-ui/icons/Add'
import Router from 'next/router'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(2),
    marginLeft: 'auto',
  }
}))

export default function OpenBoard() {
  const [name, setName] = useState('')
  const styles = useStyles()
  return <Card>
    <CardContent>
      <Typography variant="h5">
        Open a Board
      </Typography>
      <Typography variant="subtitle1">
        IPFS Boards is a work in progress. Thank you for testing the app!
      </Typography>
    </CardContent>
    <Divider />
    <CardContent>
      <TextField
        placeholder="Type a name..."
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        className={styles.button}
        disabled={!name}
        onClick={() => Router.push(`/b/${name}`)}
      >
        <OpenIcon /> Open
      </Button>
    </CardContent>
  </Card>
}
