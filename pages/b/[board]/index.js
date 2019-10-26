import React from 'react'
import { Fab, Card, CardActions, CardHeader, Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import ViewIcon from '@material-ui/icons/Visibility'
import { openBoard } from '../../../components/system'
import Router from 'next/router'

class Board extends React.PureComponent { 
  state = { posts: [] }

  componentDidMount() {
    this.refreshPosts()
  }

  async refreshPosts() {
    const { boardId } = this.props
    const board = await openBoard(boardId) 
    this.setState({ posts: board.posts })
  }

  render() {
    const { boardId } = this.props
    const posts = this.state.posts || this.props.posts
    return (
      <React.Fragment>
        {posts.map(p => <Card key={p.multihash}>
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
        {posts.length === 0 && <Card>
          <CardHeader
            title="No Posts Yet"
            subheader="Why don't you break the ice?"
          />
        </Card>}
        <Fab color="primary" onClick={() => Router.push(`/b/${boardId}/p/new`)}><AddIcon /></Fab>
      </React.Fragment>
    )
  }
}

Board.getInitialProps = async ({ query }) => {
  const board = await openBoard(query.board)
  return { posts: await board.posts, boardId: query.board }
}

export default Board
