import React from 'react'
import { TextField, InputAdornment, IconButton } from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import { openBoard } from './system'

class AddComment extends React.PureComponent {
  state = { text: '' }

  render() {
    const { text } = this.state
    return (
      <TextField
        variant="outlined"
        label="Comment"
        placeholder="What's on your mind?"
        value={text}
        onChange={event => this.setState({ text: event.target.value })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={this.submit} disabled={!text}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    )
  }
  
  submit = async () => {
    const { boardId, postId, parentId, afterSend } = this.props
    const { text } = this.state
    const board = await openBoard(boardId)
    const comment = { text }
    await board.commentPost(postId, comment, parentId)
    if (afterSend) afterSend()
  }
}

export default AddComment


