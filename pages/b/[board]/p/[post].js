
import React from 'react'
import { Fab, Card, CardContent, CardContentText, CardHeader, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ProfileIcon from '@material-ui/icons/AccountCircle'

const Post = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title="First Post"
          subheader="Last Activity X Time Ago"
        />
        <CardContent>
          <CardContentText>Lorem Ipsum...</CardContentText>
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
      <Fab color="primary"><AddIcon /></Fab>
    </React.Fragment>
  )
}

export default Post
