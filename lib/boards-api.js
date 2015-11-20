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
  if(typeof str === 'string'){
    var obj
    try {
      obj = JSON.parse(str)
    } catch (e) {
      console.log('error parsing:',str,'Error:',e)
      return done(e,null)
    }
    done(null,obj)
  } else {
    done(null,str)
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
  this.version = 'ipfs:boards:version:dev'
  this.baseurl = '/ipfs-boards-profile/'
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
  if(handler && handler.apply) this.ee.on(n,handler)
  var cached = this.users[n]
  if(cached){
    this.ee.emit(n,cached)
    console.log(n,'was cached',cached)
  } else {
    console.log(n,'not cached')
  }
  if(this.resolving_ipns[n] != true){
    this.resolving_ipns[n] = true
    this.ipfs.name.resolve(n,(err,r) => {
      if(err){
        // Communicate error
        this.ee.emit('error',err)
      } else {
        var url = r.Path
        if(url === undefined){
          console.log('UNDEFINED URL',r)
        }
        if(this.users[n] != url) this.isUserProfile(url,(isit,err) => {
          if(isit){
            console.log(n,'is a user')
            if(this.users[n] === undefined) this.ee.emit('user',n,url)
            this.users[n] = url
            this.ee.emit(n,url)
            this.backupCache()
          } else {
            console.log(n,'not a valid profile:',err)
            this.ee.emit(n,undefined,'not a valid profile: '+err)
          }
          this.resolving_ipns[n] = false
          return true // Remove from listeners
        })
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
      var v = res.trim()
      console.log('Version in profile snapshot',addr,'is',v)
      if(v === this.version)
        done(true)
      else
        done(false,'version mismatch: is "'+v+'" but should be "'+this.version+'"')
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
  this.ipfs.dht.findprovs(this.version_hash, (err,res) => {
    if(err){
      console.log('DHT FINDPROVS err',err)
    } else if(res.readable){
      console.log('DHT FINDPROVS stream',res)
    } else {
      console.log('DHT FINDPROVS string',res)
    }
  })
  return this.ee
}

BoardsAPI.prototype.getProfile = function(userID,done){
  console.log('profile requested for',userID)
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
          // It already returns a JSON?
          this.ee.emit('profile for '+userID,res)
          done(null,res)
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
  this.resolveIPNS(userID,(r,e) => {
    if(e){
      this.ee.emit('error',e)
    } else {
      var url = r+this.baseurl+'boards/'+board+'/settings.json'
      this.ipfs.cat(url,(err,settings) => {
        if(err){
          this.ee.emit('error',err)
        } else {
          // SETTINGS file is here, need to parse it a little bit
          this.ee.emit('settings for '+board+'@'+userID,settings,r)
          if(settings.whitelist == true){
            // Get the whitelist
            var url = r+this.baseurl+'boards/'+board+'/whitelist'
            this.ipfs.cat(url,(err,whitelist) => {
              if(err){
                this.ee.emit('error',err)
                // Emit an empty whitelist.
                this.emit('whitelist for '+board+'@'+userID,[])
              } else {
                // Send whitelist
                var w = whitelist.split(' ')
                this.emit('whitelist for '+board+'@'+userID,w)
              }
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

BoardsAPI.prototype.getPostsInBoard = function(adminID,board){
  var downloadPost = (hash,op) => {
    this.ipfs.cat(hash,(err2,r) => {
      if(err2){
        this.ee.emit('error',err2)
        console.log('Could not download post',hash,'of',board+'@'+adminID)
      } else {
        // It already returns a JSON?
        var post = r
        if(op) post.op = op // Inject op
        this.ee.emit('post in '+board+'@'+adminID,post,hash)
      }
    })
  }
  this.getBoardSettings(adminID,board)
  this.ee.on('settings for'+board+'@'+adminID,function(settings,addr){
    // Download posts based on settings
    if(settings.approval_required == true){
      // Get approved posts list
      var a = addr+this.baseurl+'boards/'+board+'/approved/posts/'
      this.ipfs.ls(a,(err,res) => {
        if(err){
          this.ee.emit('error',err)
        } else {
          // Send approved posts list
          var ret = res.Objects[0].Links.map(item => {
            return { date: item.Name, hash: item.Hash }
          })
          this.emit('approved posts for '+board+'@'+adminID,ret)
          // Automatically download approved posts
          ret.forEach(item => downloadPost(item.hash))
        }
      })
      if(settings.whitelist == true){
        // TODO: Download all posts from whitelisted users
      }
    } else if(settings.whitelist_only == true){
      // TODO: download all posts from whitelisted users
    } else if(settings.blacklist == true){
      // TODO: get the blacklist, then start downloading posts from everyone not in the blacklist
    }
  })
  // Get the admin's posts
  this.getUserPostListInBoard(adminID,board,(err,res) => {
    if(err){
      console.log(err)
    } else res.forEach(item => downloadPost(item.hash,adminID))
  })
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

BoardsAPI.prototype.getCommentsFor = function(parent,board,adminID){
  // Create an EventEmitter, start looking and emit an event for every new comment
  // Consider the rules of @adminID#board
}

// API for publishing content and managing to be done later...

// Initialize API
BoardsAPI.prototype.init = function(done){
  this.ipfs.id( (err, res) => {
    if(err){
      console.log('Error while getting OWN ID:',err)
      this.ee.emit('error',err)
      done(err)
    } else if(res.ID){
      console.log('I am',res.ID)
      this.id = res.ID
      this.resolveIPNS(res.ID)
      console.log('Version is',this.version)
      this.ipfs.add(new Buffer('ipfs:boards:version:'+this.version),{n: true},(err2,r) => {
        if(err2){
          this.ee.emit('error',err2)
          console.log('Error while calculating version hash:',err2)
          done(err2)
        } else {
          if(r && r.Hash) this.version_hash = r.Hash
          if(r && r[0] && r[0].Hash) this.version_hash = r[0].Hash
          console.log('Version hash is',this.version_hash)
          done(null)
        }
      })
    }
  })
  this.ipfs.version((err,res) => {
    if(err){
      this.ee.emit('error',err)
      console.log('Error while getting ipfs version:',err)
    } else {
      this.ipfs_version = res.Version
      console.log('IPFS Version is',res.Version)
    }
  })
}

BoardsAPI.prototype.getEventEmitter = function(){
  return this.ee
}

BoardsAPI.prototype.getUsers = function(){
  return Object.keys(this.users)
}

module.exports = BoardsAPI
