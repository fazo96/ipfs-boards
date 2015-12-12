/*
This file contains the IPFS Boards API. It's a simple abstraction over the
js-ipfs-api that also provides an additional level of caching for this
particular application. Let's hope it turns out decent

Needs to be browserified to work in the browser
*/

// EventEmitter used to communicate with clients
var EventEmitter = require('wolfy87-eventemitter')
var asyncjs = require('async')

function asObj(str,done){
  if(str.toString) str = str.toString()
  if(typeof str === 'string'){
    var obj
    try {
      obj = JSON.parse(str)
    } catch (e) {
      console.log('error parsing:',str,'Error:',e)
      return done(e,undefined)
    }
    done(null,obj)
  } else {
    console.log('not string:',str)
    done('not string: '+str,undefined)
  }
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
  } else if(res.split || res.toString){
    //console.log('got string or buffer:',res)
    if(res.toString) res = res.toString()
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
  this.version = 'ipfs:boards:version:dev'
  this.baseurl = '/ipfs-boards-profile/'
  this.users = [] // list of IPNS names
  this.resolvingIPNS = {}
  this.ee = new EventEmitter()
  if(localStorage !== undefined){
    // Use localStorage to store the IPNS cache
    var stored = localStorage.getItem('ipfs-boards-user-cache')
    try {
      this.users = JSON.parse(stored)
      if(this.users === null || this.users === undefined || !this.users.indexOf || !this.users.push){
        this.users = []
      }
    } catch(e){
      this.users = []
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
  if(handler && handler.apply) this.ee.on(n,handler)
  if(!this.resolvingIPNS[n]){
    this.resolvingIPNS[n] = true
    this.ipfs.name.resolve(n,(err,r) => {
      delete this.resolvingIPNS[n]
      if(err){
        // Communicate error
        this.ee.emit('error',err)
      } else {
        var url = r.Path
        if(url === undefined){
          console.log('Could not resolve',n)
          this.ee.emit('error',r.Message)
        } else if(this.users.indexOf(n) < 0){ // new find
          this.isUserProfile(url,(isit,err) => {
            if(isit){
              console.log(n,'is a user')
              this.ee.emit(n,url)
              if(this.users.indexOf(n) < 0){
                this.ee.emit('user',n,url)
                this.users.push(n)
                this.backupCache()
              }
            } else {
              console.log(n,'not a valid profile:',err)
              this.ee.emit(n,undefined,'not a valid profile: '+err)
            }
            return true // Remove from listeners
          })
        } else { // Already known
          this.ee.emit(n,url)
        }
      }
    })
  }
  return this.ee
}

BoardsAPI.prototype.isUserProfile = function(addr,done){
  if(addr === undefined) return console.log('Asked to check if undefined is a profile')
  this.ipfs.cat(addr+this.baseurl+'ipfs-boards-version.txt',(err,r) => {
    if(err) return done(false,err)
    replyAsObj(r,false,(_,res) => {
      if(!res || !res.trim){
        console.log('Could not read version from',addr)
      } else {
        var v = res.trim()
        console.log('Version in profile snapshot',addr,'is',v)
        if(v === this.version){
          done(true)
        } else {
          done(false,'version mismatch: is "'+v+'" but should be "'+this.version+'"')
        }
      }
    })
  })
}

BoardsAPI.prototype.searchUsers = function(){
  // Look at our peers
  this.ipfs.swarm.peers((err,r) => {
    if(err) return console.log(err)
    replyAsObj(r,true,(e,reply) => {
      if(e){
        this.ee.emit('error',e)
        return console.log('There was an error while getting swarm peers:',e)
      }
      console.log('Checking',reply.Strings.length,'peers')
      //reply.Strings.forEach(item => {
      var f = (item, done) => {
        var ss = item.split('/')
        var n = ss[ss.length-1]
        this.ee.once(n,(res,err) => done(err))
        this.resolveIPNS(n)
      }
      asyncjs.eachSeries(reply.Strings,f.bind(this))
    })
  })
  // Look for who has the correct version file, they probably have a profile
  /*
  this.ipfs.dht.findprovs(this.version_hash, (err,res) => {
    if(err){
      console.log('DHT FINDPROVS err',err)
    } else if(res.readable){
      console.log('DHT FINDPROVS stream',res)
    } else {
      console.log('DHT FINDPROVS string',res)
    }
  })*/
  return this.ee
}

BoardsAPI.prototype.getProfile = function(userID,done){
  this.resolveIPNS(userID,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err,null)
    } else {
      // Download actual profile
      this.ipfs.cat(url+this.baseurl+'profile.json',(err2,res) => {
        if(err2){
          this.ee.emit('error',err2)
          done(err2,null)
        } else {
          // TODO: JSON parse error handling
          var p = JSON.parse(res.toString())
          this.ee.emit('profile for '+userID,p)
          done(null,p)
        }
      })
      // Get other info
      this.ipfs.ls(url+this.baseurl+'boards/',(err2,res) => {
        if(!err2){
          var l = res.Objects[0].Links.map(i => {
            return { name: i.Name, hash: i.Hash }
          })
          this.ee.emit('boards for '+userID,l)
        } else {
          this.ee.emit('error',err2)
        }
      })
    }
    return true // remove myself from listeners
  })
  return this.ee
}

BoardsAPI.prototype.getBoardSettings = function(userID,board){
  if(!userID){
    return console.log('Invalid USERID',userID)
  }
  if(!board){
    return console.log('Invalid BOARD',board)
  }
  this.resolveIPNS(userID,(r,e) => {
    if(e){
      this.ee.emit('error',e)
    } else {
      var url = r+this.baseurl+'boards/'+board+'/settings.json'
      this.ipfs.cat(url,(err,resp) => {
        // TODO: error handling json conversion
        var settings = JSON.parse(resp.toString())
        if(err){
          this.ee.emit('error',err)
        } else {
          // SETTINGS file is here, need to parse it a little bit
          this.ee.emit('settings for '+board+'@'+userID,settings,r)
          if(settings.whitelist == true){
            // Get the whitelist
            var url = r+this.baseurl+'boards/'+board+'/whitelist'
            this.ipfs.cat(url,(err,res) => {
              if(err){
                this.ee.emit('error',err)
                // Emit an empty whitelist.
                this.ee.emit('whitelist for '+board+'@'+userID,[])
              } else replyAsObj(res,false,(err,whitelist) => {
                // Send whitelist
                var w = whitelist.split(' ').map(x => x.trim())
                this.ee.emit('whitelist for '+board+'@'+userID,w)
              })
            })
          }
          if(!settings.whitelist_only && !settings.approval_required && settings.blacklist == true){
            // Get the blacklist
            var u = r+this.baseurl+'boards/'+board+'/blacklist'
            this.ipfs.cat(u,(err,blacklist) => {
              if(err){
                this.ee.emit('error',err)
              } else {
                // Send blacklist
                var w = blacklist.split(' ')
                this.emit('blacklist for '+board+'@'+userID,w)
              }
            })
          }
        }
      })
    }
    return true // remove myself from listeners
  })
  return this.ee
}

BoardsAPI.prototype.downloadPost = function(hash,adminID,board,op,done){
  console.log('Downloading post',hash)
  this.ipfs.cat(hash,(err2,r) => {
    if(err2){
      this.ee.emit('error',err2)
      console.log('Could not download post',hash,'of',board+'@'+adminID)
      if(done && done.apply) done(err2)
    } else {
      replyAsObj(r,true,(err,post) => {
        // TODO: add JSON parsing error handling
        post.hash = hash
        if(op) post.op = op // Inject op
        if(board){
          if(adminID) this.ee.emit('post in '+board+'@'+adminID,post,hash)
          else this.ee.emit('post in '+board,post,hash)
        }
        this.ee.emit(hash,post,adminID,board)
        if(done && done.apply) done(null,post)
      })
    }
  })
  return this.ee
}

BoardsAPI.prototype.retrieveListOfApproved = function(what,addr,adminID,board){
  var a = addr+this.baseurl+'boards/'+board+'/approved/'+what+'/'
  this.ipfs.ls(a,(err,res) => {
    if(err){
      this.ee.emit('error',err)
    } else {
      // Send approved posts list
      var ret = res.Objects[0].Links.map(item => {
        return { date: item.Name, hash: item.Hash }
      })
      this.emit('approved '+what+' for '+board+'@'+adminID,ret)
    }
  })
}

BoardsAPI.prototype.getAllowedContentProducers = function(adminID,board,options){
  if(!options) return
  this.ee.on('settings for '+board+'@'+adminID,function(settings,addr){
    // Get stuff based on settings
    if(settings.approval_required == true){
      // Get approved posts list
      if(options.posts) this.retrieveListOfApproved('posts',addr,adminID,board)
      // Get approved comments list
      if(options.comments) this.retrieveListOfApproved('comments',addr,adminID,board)
    } else if(settings.whitelist_only == true){
      // TODO: emit all whitelisted users
    } else if(settings.blacklist == true){
      // TODO: emit all users not in the blacklist
    }
  })
  this.getBoardSettings(adminID,board)
  return this.ee
}

BoardsAPI.prototype.getPostsInBoard = function(adminID,board){
  if(adminID){
    this.ee.on('approved posts for '+board+'@'+adminID,ret => {
      // Automatically download approved posts
      ret.forEach(item => this.downloadPost(item.hash,adminID,board))
    })
    this.ee.on('whitelist for '+board+'@'+adminID, whitelist => {
      // download posts for each user in whitelist
      whitelist.forEach(item => {
        this.getUserPostListInBoard(item,board,(err,postList) => {
          postList.forEach( i => this.downloadPost(i.hash,adminID,board,item))
        })
      })
    })
    // Get allowed content and content producers
    this.getAllowedContentProducers(adminID,board,{ posts: true })
    // Get the admin's posts
    this.getUserPostListInBoard(adminID,board,(err,res) => {
      if(err){
        console.log(err)
      } else res.forEach(item => this.downloadPost(item.hash,adminID,board,adminID))
    })
  } else {
    // TODO: Download all posts in board from everyone
    // Download my posts
    this.getUserPostListInBoard(this.id,board,(err,res) => {
      if(err){
        console.log(err)
      } else res.forEach(item => this.downloadPost(item.hash,undefined,board,this.id))
    })
  }
  return this.ee
}

BoardsAPI.prototype.getUserPostListInBoard = function(user,board,done){
  this.resolveIPNS(user,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err)
    } else this.ipfs.ls(url+this.baseurl+'posts/'+board,(e,r) => {
      if(e){
        this.ee.emit('error',e)
        done(e)
      } else if(r && !r.split){
        console.log('Found',r.Objects[0].Links.length,'posts in',board,'at',user)
        this.ee.emit('post count',board,user,r.Objects[0].Links.length)
        var l = r.Objects[0].Links.map(i => {
          return { date: i.Name, hash: i.Hash }
        })
        done(null,l)
      }
    })
    return true // remove myself from listeners
  })
  return this.ee
}

BoardsAPI.prototype.downloadComment = function(hash,adminID,board,done){
  this.ipfs.cat(hash,(err2,r) => {
    if(err2){
      this.ee.emit('error',err2)
      console.log('Could not download comment',hash,'of',board+'@'+adminID)
      if(done && done.apply) done(err2)
    } else {
      // TODO: add JSON parsing error handling
      var cmnt = JSON.parse(r.toString())
      cmnt.hash = hash
      this.ee.emit(hash,cmnt,adminID,board)
      this.ee.emit('comment for '+cmnt.parent,cmnt)
      if(done && done.apply) done(null,cmnt)
    }
  })
  return this.ee
}

BoardsAPI.prototype.getCommentsFor = function(parent,board,adminID){
  if(!parent || !board || !adminID){
    return console.log('malformed arguments:',parent,board,adminID)
  }
  this.ee.on('approved comments for '+board+'@'+adminID,ret => {
    ret.forEach(item => this.downloadComment(item.hash,adminID,board))
  })
  // get the admin's comments
  this.getUserCommentList(parent,adminID,(err,res) => {
    if(!err){
      res.forEach(item => this.downloadComment(item.hash,adminID,board))
    }
  })
  this.getAllowedContentProducers(adminID,board,{ comments: true })
}

BoardsAPI.prototype.getUserCommentList = function(parent,user,done){
  if(!parent || !user){
    return console.log('Malformed arguments:',parent,user)
  }
  this.resolveIPNS(user,(url,err) => {
    if(err){
      this.ee.emit('error',err)
      done(err)
    } else this.ipfs.ls(url+this.baseurl+'comments/'+parent,(e,r) => {
      if(e){
        this.ee.emit('error',e)
        done(e)
      } else if(r && !r.split){
        if(r.Objects && r.Objects[0]){ // If this is not true, then there are no comments
          console.log('Found',r.Objects[0].Links.length,'comments for',parent,'at',user)
          var l = r.Objects[0].Links.map(i => {
            return { date: i.Name, hash: i.Hash }
          })
          done(null,l)
        }
      }
    })
    return true // remove myself from listeners
  })
  return this.ee
}

// API for publishing content and managing to be done later...

// Initialize API
BoardsAPI.prototype.init = function(done){
  if(this.isInit) return
  this.ipfs.id( (err, res) => {
    if(err){
      console.log('Error while getting OWN ID:',err)
      this.ee.emit('error',err)
      this.ee.emit('init',err)
      if(done && done.apply) done(err)
    } else if(res.ID){
      console.log('I am',res.ID)
      this.id = res.ID
      this.resolveIPNS(res.ID)
      console.log('Version is',this.version)
      this.ipfs.add(new Buffer('ipfs:boards:version:'+this.version),{n: true},(err2,r) => {
        if(err2){
          this.ee.emit('error',err2)
          console.log('Error while calculating version hash:',err2)
          this.ee.emit('init',err2)
          if(done && done.apply) done(err2)
        } else {
          if(r && r.Hash) this.version_hash = r.Hash
          if(r && r[0] && r[0].Hash) this.version_hash = r[0].Hash
          console.log('Version hash is',this.version_hash)
          this.ipfs.version((err,res) => {
            if(err){
              this.ee.emit('error',err)
              this.ee.emit('init',err)
              console.log('Error while getting ipfs version:',err)
              if(done && done.apply) done(err)
            } else {
              this.ipfs_version = res.Version
              console.log('IPFS Version is',res.Version)
              this.ee.emit('init',undefined)
              this.isInit = true
              if(done && done.apply) done(null)
            }
          })
        }
      })
    }
  })
}

BoardsAPI.prototype.getEventEmitter = function(){
  return this.ee
}

BoardsAPI.prototype.getUsers = function(){
  return this.users
}

BoardsAPI.prototype.getMyID = function(){
  return this.id
}

module.exports = BoardsAPI
