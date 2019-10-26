import React, { useState } from 'react'
import { Card, CardContent, TextField, Button } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'

export default function CreatePost() {
  const [title, setTitle] = useState('')
  return <Card>
    <CardContent>
      <TextField
        label="Title"
        placeholder="What is your Post about?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        autoFocus
      />
      <Button variant="contained" color="primary">
        <SendIcon /> Submit
      </Button>
    </CardContent>
  </Card>
}
