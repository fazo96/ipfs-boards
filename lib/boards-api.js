// Write an API to aggregate data without duplication and making accessing content easy. Use the IPFS http api

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
    res.setEncoding('utf8')
    var data = ''
    res.on('data',d => {
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
  this.users = {}
}

// This function works but needs a little rethinking.
BoardsAPI.prototype.resolveIPNS = function(n,done){
  var cached = this.users[n]
  if(cached){
    done(null,cached)
  }
  this.ipfs.name.resolve(n,(err,r) => {
    console.log('Resolved',n,'to',r)
    if(err){
      done(err)
    } else if(!cached){
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

BoardsAPI.prototype.isUser = function(s){
  var ss = s.split('/')
  var addr = ss[ss.length-1]
  // Try to see if they run IPFS Boards
  console.log('Is',addr,'a user?')
  this.resolveIPNS(addr,(err,url) => {
    if(err) return console.log('Cannot resolve',addr,':',err)
    this.isUserProfile(url,isit => {
      if(isit == this.version){
        console.log(addr,'is a user')
        this.users[addr] = url
      }
    })
  })
}

BoardsAPI.prototype.searchUsers = function(){
  // Look at our peers
  this.ipfs.swarm.peers((err,r) => {
    if(err) return console.log(err)
    replyAsObj(r,true,(e,reply) => {
      reply.Strings.forEach(this.isUser.bind(this))
    })
  })
}

BoardsAPI.prototype.getProfile = function(userID,done){
  this.ipfs.cat(userID+'/profile.json',(err,res) => {
    if(err){
      done(err,null)
    } else {
      replyAsObj(res,true,done)
    }
  })
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
  console.log("Getting Board Settings:",url)
  this.ipfs.cat(url,function(err,res){
    console.log('Done')
    if(err){
      done(err,{})
    } else {
      replyAsObj(res,true,done)
    }
  })
}

BoardsAPI.prototype.getBoardPosts = function(board,administratorID,done){
  // Returns a stream
}

BoardsAPI.prototype.getUserPosts = function(user,board,done){
  // Returns a stream
}

BoardsAPI.prototype.getComments = function(parent,board,done){
  // Returns a stream
}

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
        this.version_hash = r[0].Hash
        console.log('Version hash is',this.version_hash)
        done(null)
      })
    }
  })
}

module.exports = BoardsAPI
