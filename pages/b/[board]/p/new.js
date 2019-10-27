import React, { useState } from 'react'
import { openBoard } from '../../../../components/system'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Card, CardHeader, CardContent, TextField, Button, Avatar } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import AddIcon from '@material-ui/icons/Add'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  field: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  secondaryButton: {
    marginLeft: theme.spacing(2)
  },
  buttonIcon: {
    marginLeft: theme.spacing(1)
  }
}))

async function createPost(boardId, postData) {
  const board = await openBoard(boardId)
  await board.addPost(postData)
  Router.push(`/b/${boardId}`)
}

export default function CreatePost({ boardId }) {
  const classes = useStyles()
  const [title, setTitle] = useState('')
  return <Card className={classes.card}>
    <CardHeader
      avatar={<Avatar><AddIcon /></Avatar>}
      title="Post Something"
      subheader={<React.Fragment>
        Your post will be published to the <b>{boardId}</b> board
      </React.Fragment>}
    />
    <CardContent>
      <TextField
        className={classes.field}
        variant="outlined"
        label="Title"
        placeholder="What is your Post about?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
        fullWidth
      />
      <TextField
        className={classes.field}
        variant="filled"
        label="CID"
        placeholder="Paste the IPFS CID or your post content (WIP)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={() => createPost(boardId, { title })}>
        Submit <SendIcon className={classes.buttonIcon} />
      </Button>
      <Button className={classes.secondaryButton} onClick={() => Router.push(`/b/${boardId}`)}>
        Cancel
      </Button>
    </CardContent>
  </Card>
}

CreatePost.getInitialProps = ({ query }) => {
  return { boardId: query.board }
}
