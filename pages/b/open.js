import React, { useState } from 'react'
import { Card, CardContent, TextField, Button } from '@material-ui/core'
import OpenIcon from '@material-ui/icons/Add'

export default function OpenBoard() {
  const [name, setName] = useState('')
  return <Card>
    <CardContent>
      <TextField
        label="Board"
        placeholder="Type a name..."
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />
      <Button variant="contained" color="primary">
        <OpenIcon /> Open
      </Button>
    </CardContent>
  </Card>
}
