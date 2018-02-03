const Store = require('orbit-db-store')
const BoardIndex = require('./BoardIndex')

class Board extends Store {
  constructor(ipfs, id, dbname, options) {
    if (!options) options = {}
    if (!options.indexBy) Object.assign(options, { indexBy: '_id' })
    if (!options.Index) Object.assign(options, { Index: BoardIndex })
    super(ipfs, id, dbname, options)
    this._type = 'board' 
  }

  get type() {
    return 'discussion-board'
  }

  updateMetadata() {
    throw new Error('Not implemented yet')
  }

  getPosts() {
    throw new Error('Not implemented yet')
  }

  addPost(title, content) {
    this._addOperation({
      title,
      content
    })
  }

  updatePost() {
    throw new Error('Not implemented yet')
  }

  addComment() {
    throw new Error('Not implemented yet')
  }

  updateComment() {
    throw new Error('Not implemented yet')
  }
}

module.exports = Board