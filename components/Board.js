import React from 'react'
import { Card, CardActions, CardHeader, Button, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import ViewIcon from '@material-ui/icons/Visibility'
import EmptyIcon from '@material-ui/icons/HourglassEmpty'
import Router from 'next/router'

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(2),
  },
  buttonIcon: {
    marginRight: theme.spacing(1)
  },
  button: {
    marginLeft: theme.spacing(2)
  }
}))

export default function Board({ boardId, posts }){
  const classes = useStyles()
  return (
    <React.Fragment>
      {posts.map(p => <Card key={p.multihash} className={classes.card}>
        <CardHeader
          title={p.title}
          subheader="Last Activity X Time Ago"
        />
        <CardActions>
          <Button variant="contained" color="primary" onClick={() => Router.push(`/b/${boardId}/p/${p.multihash}`)}>
            <ViewIcon /> View
          </Button>
        </CardActions>
      </Card>)}
      {posts.length === 0 && <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar><EmptyIcon /></Avatar>}
          title="No Posts Yet"
          subheader="Don't panic. Your device will keep looking for new posts in the network."
        />
      </Card>}
      <Button
        variant="contained"
        color="primary"
        onClick={() => Router.push(`/b/${boardId}/p/new`)}
        className={classes.button}
      >
        <AddIcon className={classes.buttonIcon} /> Post Something
      </Button>
    </React.Fragment>
  )
}