/*
This file contains the IPFS Boards API. It's a simple abstraction over the
js-ipfs-api that also provides an additional level of caching for this
particular application. Let's hope it turns out decent

Needs to be browserified to work in the browser
*/

// EventEmitter used to communicate with clients
var EventEmitter = require('wolfy87-eventemitter')

function asObj(str,done){
  var obj
  try {
    obj = JSON.parse(str)
  } catch (e) {
    return done(e,null)
  }
  done(null,obj)
}

function replyAsObj(res,isJson,done){
  if(res.readable){
    // Is a stream
    console.log('got stream')
    res.setEncoding('utf8')
    var data = ''
    res.on('data',d => {
      console.log('got stream data:',d)
      data += d
    })
    res.on('end',() => {
      if(isJson) {
        asObj(data,done)
      } else {
        done(null,data)
      }
    })
  } else {
    //console.log('got string:',res)
    // Is a string
    if(isJson){
      asObj(res,done)
    } else {
      done(null,res)
    }
  }
}

function BoardsAPI(ipfs){
  this.ipfs = ipfs
  this.version = 'dev'
  this.users = {} // userID : profileHash
  this.resolving_ipns = {} // to check if a resolve is already in progress
  this.ee = new EventEmitter()
  if(localStorage !== undefined){
    // Use localStorage to store the IPNS cache
    var stored = localStorage.getItem('ipfs-boards-user-cache')
    try {
      this.users = JSON.parse(stored)
      if(this.users === null || this.users === undefined){
        this.users = {}
      }
    } catch(e){
      this.users = {}
    }
  }
}

BoardsAPI.prototype.backupCache = function(){
  if(localStorage !== undefined){
    // Use localStorage to store the IPNS cache
    localStorage.setItem('ipfs-boards-user-cache',JSON.stringify(this.users))
  }
}

// Rewrote this to use event emitters. Should also add periodic rechecking
BoardsAPI.prototype.resolveIPNS = function(n,handler){
  if(handler) this.ee.on(n,handler)
  var cached = this.users[n]
  //console.log('Cached is',cached)
  if(cached){
    this.ee.emit(n,cached)
  }
  if(this.resolving_ipns[n] != true){
    this.resolving_ipns[n] = true
    this.ipfs.name.resolve(n,(err,r) => {
      setTimeout(_ => {
        console.log('Launching automatic check for IPNS address',n)
        this.resolveIPNS(n)
      },20*1000)
      if(!err) console.log('Resolved',n,'to',r.Path)
      if(err){
        // Communicate error
        this.ee.emit(n,undefined,err)
      } else if(cached !== r.Path){
        //console.log('oldcache',this.users)
        //console.log('Setting cache for',n,'to',r.Path)
        this.users[n] = r.Path
        this.backupCache()
        this.ee.emit(n,r.Path)
      }
    })
  }
  return this.ee
}

BoardsAPI.prototype.isUserProfile = function(addr,done){
  this.ipfs.cat(addr+'/ipfs-boards-version.txt',(err,r) => {
    if(err) return done(false)
    replyAsObj(r,false,(_,res) => {
      var v = res.trim()
      console.log('Version for',addr,'is',v)
      done(v)
    })
  })
}

BoardsAPI.prototype.isUser = function(s,done){
  var ss = s.split('/')
  var addr = ss[ss.length-1]
  // Try to see if they run IPFS Boards
  this.resolveIPNS(addr,(url,err) => {
    if(err){
      if(done) done(false)
      return console.log('Cannot resolve',addr,':',err)
    }
    this.isUserProfile(url,isit => {
      if(isit == this.version){
        console.log(addr,'is a user')
        this.users[addr] = url
        if(done) done(true,addr,url)
      } else if(done) done(false)
    })
    return true // remove myself from listeners
  })
}

BoardsAPI.prototype.searchUsers = function(){
  // Look at our peers
  this.ipfs.swarm.peers((err,r) => {
    if(err) return console.log(err)
    replyAsObj(r,true,(e,reply) => {
      console.log('Checking',reply.Strings.length,'peers')
      reply.Strings.forEach(item => {
        this.isUser(item,(isit,addr,url) => {
          if(isit){
            this.ee.emit('found user',addr,url)
          }
        })
      })
    })
  })
  return this.ee
}

BoardsAPI.prototype.getProfile = function(userID,done){
  console.log('profile requested for',userID)
  this.resolveIPNS(userID,(url,err) => {
    if(err){
      done(err,null)
    } else {
      // Download actual profile
      this.ipfs.cat(url+'/profile.json',(err2,res) => {
        if(err2){
          done(err2,null)
        } else {
          // It already returns a JSON?
          done(null,res)
        }
      })
      // Get other info
      this.ipfs.ls(url+'/boards/',(err2,res) => {
        if(!err2){
          console.log('RES',res)
          var l = res.Objects[0].Links.map(i => {
            return { name: i.Name, hash: i.Hash }
          })
          this.ee.emit('boards',l)
        } else console.log(err2)
      })
    }
    return true // remove myself from listeners
  })
  return this.ee
}

BoardsAPI.prototype.getBoardSettings = function(userID,board,done){
  this.resolveIPNS(userID,(r,e) => {
    if(e){
      done(e)
    } else {
      var url = r+'/boards/'+board+'/settings.json'
      this.ipfs.cat(url,(err,res) => {
        if(err){
          done(err)
        } else {
          // It's already json...
          done(err,res)
        }
      })
    }
    return true // remove myself from listeners
  })
}

BoardsAPI.prototype.getPostsInBoard = function(adminID,board){
  /*
  this.getBoardSettings(administratorID,board,(err,res) => {
    // NEEDS: board settings structure definition
    // For now we only list admin's posts
  })
  */
  this.getUserPostListInBoard(adminID,board,(err,res) =>{
    if(err){
      console.log(err)
    } else res.forEach(item => {
      this.ipfs.cat(item.hash,(err2,r) => {
        if(err2){
          console.log('Could not download post',item,'of',board+'@'+adminID)
        } else {
          // It already returns a JSON?
          this.ee.emit('post',r,item.hash)
        }
      })
    })
  })
  return this.ee
}

BoardsAPI.prototype.getUserPostListInBoard = function(user,board,done){
  var ee = new EventEmitter()
  this.resolveIPNS(user,(url,err) => {
    if(err){
      done(err)
    } else this.ipfs.ls(url+'/posts/'+board,(e,r) => {
      if(e){
        done(e)
      } else if(r && !r.split){
        console.log('Found',r.Objects[0].Links.length,'posts in',board,'at',user)
        ee.emit('post count',board,user,r.Objects[0].Links.length)
        var l = r.Objects[0].Links.map(i => {
          return { date: i.Name, hash: i.Hash }
        })
        done(null,l)
      }
    })
    return true // remove myself from listeners
  })
  return ee
}

BoardsAPI.prototype.getCommentsFor = function(parent){
  // Create an EventEmitter, start looking and emit an event for every new comment
}

// API for publishing content and managing to be done later...

// Initialize API
BoardsAPI.prototype.init = function(done){
  this.ipfs.id( (err, res) => {
    if(err){
      console.log(err)
      done(err)
    } else if(res.ID){
      console.log('I am',res.ID)
      this.id = res.ID
      this.isUser(res.ID)
      console.log('Version is',this.version)
      this.ipfs.add(new Buffer('ipfs:boards:version:'+this.version),(err,r) => {
        if(err){
          console.log('Error while calculating version hash:',err)
          done(err)
        } else {
          this.version_hash = r[0].Hash
          console.log('Version hash is',this.version_hash)
          done(null)
        }
      })
    }
  })
}

module.exports = BoardsAPI
