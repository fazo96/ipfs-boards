var BoardsAPI = function () {
  this.done = false
  this.fa = []
  this.boards
  require.ensure(['options.jsx', 'ipfs-api', 'boards-api.js'], _ => {
    var opt = require('options.jsx').get()
    var BoardsAPI = require('boards-api.js')
    var ipfs = require('ipfs-api')(opt.addr || 'localhost', opt.port || 5001)
    this.boards = new BoardsAPI(ipfs)
    this.boards.init()
    this.done = true
    this.fa.forEach(fn => fn(this.boards))
    this.fa = undefined
  })
}

BoardsAPI.prototype.use = function (f) {
  if (!f || !f.apply || !f.call) return console.log('Non-function tried to use API:', f)
  if (this.done) {
    f(this.boards)
  } else {
    this.fa.push(f)
  }
}

module.exports = BoardsAPI
