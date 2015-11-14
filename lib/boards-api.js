/*
This file contains the IPFS Boards API. It's a simple abstraction over the
js-ipfs-api that also provides an additional level of caching for this
particular application. Let's hope it turns out decent

Needs to be browserified to work in the browser
*/

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
    console.log('got string:',res)
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
  this.posts = {} // boardName : postsList
  this.comments = {} // objectID : comments
}

// This function works but needs a little rethinking.
BoardsAPI.prototype.resolveIPNS = function(n,done){
  var cached = this.users[n]
  if(cached){
    console.log('Returning cached',n,'is',this.users[n])
    done(null,cached)
  }
  this.ipfs.name.resolve(n,(err,r) => {
    if(!err) console.log('Resolved',n,'to',r.Path)
    if(err){
      done(err)
    } else if(!cached){
      this.users[n] = r.Path
      done(err,r.Path)
    } else if(cached !== r.Path){
      // Update cache
      this.users[n] = r.Path
    }
  })
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
  this.resolveIPNS(addr,(err,url) => {
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
  })
}

BoardsAPI.prototype.searchUsers = function(){
  var ee = new EventEmitter()
  // Look at our peers
  this.ipfs.swarm.peers((err,r) => {
    if(err) return console.log(err)
    replyAsObj(r,true,(e,reply) => {
      console.log('Checking',reply.Strings.length,'peers')
      reply.Strings.forEach(item => {
        this.isUser(item,(isit,addr,url) => {
          if(isit){
            ee.emit('found user',addr,url)
          }
        })
      })
    })
  })
  return ee
}

BoardsAPI.prototype.getProfile = function(userID,done){
  var ee = new EventEmitter()
  console.log('profile requested for',userID)
  this.resolveIPNS(userID,(err,url) => {
    if(err){
      done(err,null)
    } else {
      // Download actual profile
      this.ipfs.cat(url+'/profile.json',(err2,res) => {
        console.log('got something')
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
          ee.emit('boards',l)
        } else console.log(err2)
      })
    }
  })
  return ee
}

BoardsAPI.prototype.getName = function(userID,done){
  this.ipfs.cat(userID+'/name',(err,res) => {
    if(err){
      done(err,null)
    } else {
      replyAsObj(res,false,done)
    }
  })
}

BoardsAPI.prototype.getBoardSettings = function(userID,board,done){
  var url = userID+'/boards/'+board+'/settings.json'
  console.log('Getting Board Settings:',url)
  this.ipfs.cat(url,function(err,res){
    console.log('Done')
    if(err){
      done(err,{})
    } else {
      replyAsObj(res,true,done)
    }
  })
}

BoardsAPI.prototype.getPostsInBoard = function(adminID,board){
  var ee = new EventEmitter()
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
        console.log('got something')
        if(err2){
          console.log('Could not download post',item,'of',board+'@'+adminID)
        } else {
          // It already returns a JSON?
          ee.emit('post',r)
        }
      })
    })
  })
  return ee
}

BoardsAPI.prototype.getUserPostListInBoard = function(user,board,done){
  this.resolveIPNS(user,(err,url) => {
    if(err){
      done(err)
    } else this.ipfs.ls(url+'/posts/'+board,(e,r) => {
      if(e){
        done(e)
      } else if(r && !r.split){
        console.log('Found',r.Objects[0].Links.length,'posts in',board,'at',user)
        var l = r.Objects[0].Links.map(i => {
          return { date: i.Name, hash: i.Hash }
        })
        done(null,l)
      }
    })
  })
}

BoardsAPI.prototype.getCommentsFor = function(parent,done){

}

// Work only in writable mode:

BoardsAPI.prototype.createPost = function(post,board,done){

}

BoardsAPI.prototype.createComment = function(parent,comment,done){

}

BoardsAPI.prototype.createUpvote = function(parent,done){

}

// API for managing the administrations to be done later

// Initialize API
BoardsAPI.prototype.init = function(done){
  this.ipfs.id( (err, res) => {
    if(err){
      console.log(err)
      done(err)
    } else {
      console.log('I am',res.ID)
      this.id = res.ID
      this.isUser(res.ID)
      console.log('Version is',this.version)
      this.ipfs.add(new Buffer('ipfs:boards:version:'+this.version),(err,r) => {
        if(err){
          console.log('Error while calculating version hash:',err)
        }
        this.version_hash = r[0].Hash
        console.log('Version hash is',this.version_hash)
        done(null)
      })
    }
  })
}

module.exports = BoardsAPI
