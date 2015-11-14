// HTTP bindings for boards-api

var express = require('express')
var app = express()

// Generates a callback function to pass the API response to HTTP
var apiToHandler = function(request,response){
  return (function(a,b){
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

module.exports = function(boards,options){
  options = options || {}

  // Serve web app
  app.use(express.static(__dirname+'/../webapp/dist/'))

  app.get('/@:user',(req,res) => {
    boards.getProfile(req.params.user,apiToHandler(req,res))
  })

  app.get('/@:user/:board',(req,res) => {
    boards.getBoardSettings(req.params.user,req.params.board,apiToHandler(req,res))
  })

  app.listen(options.port || 3000,function(){
    console.log('Started Web Server')
  })
}
