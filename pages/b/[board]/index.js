import React from 'react'
import { openBoard, refreshInfo } from '../../../components/system'
import Board from '../../../components/Board'

class BoardPage extends React.PureComponent { 
  state = { posts: [] }

  componentDidMount() {
    this.refreshPosts()
  }

  async refreshPosts() {
    const { boardId } = this.props
    if (boardId) {
      const board = await openBoard(boardId) 
      this.setState({ posts: board.posts })
    } else {
      throw new Error('Missing boardId')
    }
  }

  render() {
    const { boardId } = this.props
    const posts = this.state.posts || this.props.posts
    return <Board boardId={boardId} posts={posts} /> 
  }
}

BoardPage.getInitialProps = async ({ query }) => {
  await refreshInfo()
  const board = await openBoard(query.board)
  return { posts: await board.posts, boardId: query.board }
}

export default BoardPage
