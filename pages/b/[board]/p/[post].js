import React from 'react'
import { openBoard } from '../../../../components/system'
import Post from '../../../../components/Post'

const findPost = (posts, id) => {
  const results = posts.filter(p => p.multihash === id)
  if (results.length > 0) return results[0]
  return undefined
}

class PostPage extends React.PureComponent {
  state = {
    post: undefined
  }

  componentDidMount() {
    this.refreshPost() 
  }

  async refreshPost() {
    const { boardId, postId } = this.props
    const board = await openBoard(boardId) 
    const post = findPost(board.posts, postId)
    this.setState({ post })
  }

  render() {
    const { post: postProp, boardId } = this.props
    const { post } = this.state
    return <Post
      post={post || postProp}
      boardId={boardId}
    />
  }
}

PostPage.getInitialProps = async ({ query }) => {
  const board = await openBoard(query.board)
  return {
    post: findPost(board.posts, query.post),
    boardId: query.board,
    postId: query.post
  }
}

export default PostPage
