import React, { useState } from 'react'
import { openBoard } from '../../../../components/system'
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, Card, CardHeader, Divider, CardActions, CardContent, TextField, Button, Avatar, Tabs, Tab } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import AddIcon from '@material-ui/icons/Add'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

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
  },
  tabContainer: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabPanel: {
    flexGrow: 1
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}))

async function createPost(boardId, postData) {
  const board = await openBoard(boardId)
  await board.addPost(postData)
  Router.push(`/b/${boardId}`)
}

export default function CreatePost({ boardId }) {
  const classes = useStyles()

  // State
  const [title, setTitle] = useState('')
  const [cid, setCID] = useState('')
  const [content, setContent] = useState('')
  const [tab, setTab] = useState(0)

  // Actions
  const submitPost = () => {
    const payload = { title }
    if (tab === 0) payload.text = content
    if (tab === 2) payload.multihash = cid
    return createPost(boardId, payload)
  }

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
    </CardContent>
    <Divider />
    <div className={classes.tabContainer}>
      <Tabs
        orientation="vertical"
        value={tab}
        onChange={(event, value) => setTab(value)}
        className={classes.tabs}
      >
        <Tab label="Text" />
        <Tab label="Media" />
        <Tab label="IPFS CID" />
      </Tabs>
      <TabPanel value={tab} index={0} className={classes.tabPanel}>
        <TextField
          multiline
          fullWidth
          placeholder="What's on your mind?"
          rows={3}
          variant="outlined"
          label="Post"
          value={content}
          onChange={event => setContent(event.target.value)}
        />
      </TabPanel>
      <TabPanel value={tab} index={1} className={classes.tabPanel}>
        WIP
      </TabPanel>
      <TabPanel value={tab} index={2} className={classes.tabPanel}>
        <TextField
          className={classes.field}
          variant="filled"
          label="CID"
          placeholder="Paste the IPFS CID or your post content (WIP)"
          value={cid}
          onChange={e => setCID(e.target.value)}
          helperText="Enter the CID or Multihash of existing IPFS content"
          fullWidth
        />
      </TabPanel>
    </div>
    <Divider />
    <CardActions>
      <Button
        className={classes.secondaryButton}
        onClick={() => Router.push(`/b/${boardId}`)}
        style={{ marginLeft: 'auto' }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={submitPost}
      >
        Submit <SendIcon className={classes.buttonIcon} />
      </Button>

    </CardActions>
  </Card>
}

CreatePost.getInitialProps = ({ query }) => {
  return { boardId: query.board }
}