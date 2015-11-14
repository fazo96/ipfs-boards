#!/usr/bin/env node

var ipfs = require('ipfs-api')('localhost','5001')
var BoardsAPI = require('../lib/boards-api.js')
var BoardsAPIHttp = require('../lib/boards-api-http.js')

var boards = new BoardsAPI(ipfs)
var server

boards.init(function(err){
  if(err){
    console.log(err)
  } else {
    server = BoardsAPIHttp(boards)
    // setInterval(boards.searchUsers.bind(boards),3 * 60 * 1000)
    // boards.searchUsers()
  }
})
