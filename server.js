#!/usr/bin/env node

var ipfs = require('ipfs-api')('localhost','5001')
var express = require('express')
var app = express()

// Serve files in ./static
app.use(express.static('static'))

// CatchAll route: serve the angular app
app.get('*',function(req,res){
  res.sendFile(__dirname+'/static/index.html')
})

// Start http server
app.listen(3000,function(){
  console.log('Started')
})
