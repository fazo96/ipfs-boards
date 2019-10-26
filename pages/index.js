import React from 'react'
import { Fab, Card, CardActions, CardHeader, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ViewIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete'
import Link from 'next/link'
import Router from 'next/router'

const Home = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title="Test Board"
          subheader="Last Activity X time ago"
        />
        <CardActions>
          <Button variant="contained" color="primary" onClick={() => Router.push(`/b/test`)}>
            <ViewIcon /> View
          </Button>
          <Button variant="contained" color="secondary">
            <DeleteIcon /> Remove
          </Button>
        </CardActions>
      </Card>
      <Link href="/b/open">
        <Fab color="primary"><AddIcon /></Fab>
      </Link>
    </React.Fragment>
  )
}

export default Home
