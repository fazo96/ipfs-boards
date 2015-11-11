#!/usr/bin/env node

var ipfs = require('ipfs-api')('localhost','5001')
var BoardsAPI = require('../lib/boards-api.js')
var express = require('express')
var app = express()

var boards = new BoardsAPI(ipfs)

// Serve web app
app.use(express.static('../webapp'))

// Generates a callback function to pass the API response to HTTP
var apiToHandler = function(request,response){
  return (function(a,b){
    var req = a
    var res = b
    return function(err,r){
      if(err){
        res.status(500)
        res.send(err)
      } else {
        if(r.split){
          res.send(r)
        } else {
          res.json(r)
        }
      }
    }
  })(request,response)
}

// Create gateways to access the BoardsAPI

app.get('/@:user',(req,res) => {
  boards.getProfile(req.params.user,apiToHandler(req,res))
})

app.get('/@:user/:board',(req,res) => {
  boards.getBoardSettings(req.params.user,req.params.board,apiToHandler(req,res))
})

//boards.searchUsers()

// Start the web server

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
