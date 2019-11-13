import React from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Button  } from '@material-ui/core'
import AddComment from './AddComment'
import CommentIcon from '@material-ui/icons/Comment'
import { openBoard } from './system'

class Comments extends React.PureComponent {
  state = {
    comments: [],
    replying: false
  }

  componentDidMount() {
    this.refreshComments()
  }

  componentDidUpdate(prevProps) {
    const { boardId, postId, parentId } = this.props
    if (prevProps.boardId !== boardId || prevProps.postId !== postId || prevProps.parentId !== parentId) {
      this.refreshComments()
    }
  }

  async refreshComments() {
    const { boardId, postId, parentId } = this.props
    const board = await openBoard(boardId)
    const comments = await board.getComments(postId, parentId)
    this.setState({ comments })
  }

  toggleReplying = () => this.setState({ replying: !this.state.replying })

  afterCommenting = () => {
    this.setState({ replying: false })
    this.refreshComments()
  }

  render() {
    const { boardId, postId, parentId, ...others } = this.props
    const { comments = [], replying } = this.state
    return (
      <List {...others}>
        {comments.length === 0 && !parentId && (
          <ListItem>
            <ListItemText>No comments yet</ListItemText>
          </ListItem>
        )}
        {replying && (
          <AddComment
            boardId={boardId}
            postId={postId}
            parentId={parentId}
            afterSend={this.afterCommenting}
          />
        )}
        <Button
          color="primary"
          onClick={this.toggleReplying}
        >
          <CommentIcon style={{ marginRight: '8px' }} />
          {parentId ? 'Reply' : 'Add Comment'}
        </Button>
        {comments.map(c => (
          <React.Fragment>
            <ListItem>
              <ListItemText>{c.text}</ListItemText>
            </ListItem>
            <Comments
              boardId={boardId}
              postId={postId}
              parentId={c.multihash}
              style={{ marginLeft: '32px' }}
            />
          </React.Fragment>
        ))}
      </List>
    )
  }
}

export default Comments

