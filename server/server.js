#!/usr/bin/env node

var ipfs = require('ipfs-api')('localhost','5001')
var BoardsAPI = require('../lib/boards-api.js')
var express = require('express')
var app = express()

var boards = new BoardsAPI(ipfs)

// Serve web app
app.use(express.static('../webapp'))

// Create gateways to access the BoardsAPI

function startWebServer(){
  // Start http server
  app.listen(3000,function(){
    console.log('Started Web Server')
  })
}

boards.init(function(err){
  if(err){
    console.log(err)
  } else {
    startWebServer()
  }
})
