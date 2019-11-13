import React from 'react'
import { Fab, Card, CardContent, CardHeader, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Comments from './Comments'
import AddIcon from '@material-ui/icons/Add'
import ProfileIcon from '@material-ui/icons/AccountCircle'

const Post = ({ post = {}, boardId }) => {
  const found = Boolean(post.multihash)
  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title={found ? post.title || 'Untitled Post' : 'Not Found'}
          subheader="Last Activity X Time Ago"
        />
        <CardContent>
          {post.text || post.multihash || '(This post is empty)'}
        </CardContent>
      </Card>
      <List>
        <ListItem>
          <ListItemAvatar><ProfileIcon /></ListItemAvatar>
          <ListItemText
            primary="Username"
            secondary="Discovered X Time Ago"
          />
        </ListItem>
      </List>
      {boardId && post.multihash && (
        <Comments boardId={boardId} postId={post.multihash} />
      )}
    </React.Fragment>
  )
}

export default Post
