import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, IconButton } from '@material-ui/core'
import ProfileIcon from '@material-ui/icons/AccountCircle'
import Status from './Status'

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}))

export default function BoardsAppBar() {
  const styles = useStyles()
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={styles.title}>IPFS Boards</Typography>
        <IconButton color="inherit"><ProfileIcon /></IconButton>
        <Status />
      </Toolbar>
    </AppBar>
  )
}
