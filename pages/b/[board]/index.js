import React from 'react'
import { Fab, Card, CardActions, CardHeader, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ViewIcon from '@material-ui/icons/Visibility'

const Board = () => {
  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title="First Post"
          subheader="Last Activity X Time Ago"
        />
        <CardActions>
          <Button variant="contained" color="primary">
            <ViewIcon /> View
          </Button>
        </CardActions>
      </Card>
      <Fab color="primary"><AddIcon /></Fab>
    </React.Fragment>
  )
}

export default Board
