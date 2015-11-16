#!/usr/bin/env node

var cli = require('commander')
var ipfs = require('ipfs-api')('localhost','5001')
var BoardsAPI = require('../lib/boards-api.js')

var boards = new BoardsAPI(ipfs)

boards.init(function(err){
  if(err){
    console.log(err)
  }
})

cli
  .version(require('package.json').version)
  .description('command line interface for IPFS boards')

cli.parse(process.argv)
