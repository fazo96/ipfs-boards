import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '600px',
    flexGrow: 2
  }
}))

const Container = ({ children }) => {
  const styles = useStyles()
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  )
}

export default Container