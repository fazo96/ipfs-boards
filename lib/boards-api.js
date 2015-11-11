// Write an API to aggregate data without duplication and making accessing content easy. Use the IPFS http api

function asObj(str,done){
  var obj
  try {
    obj = JSON.parse(str)
  } catch (e) {
    done(e,null)
  }
  if(obj != undefined) done(null,obj)
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
}

BoardsAPI.prototype.searchUsers = function(done){
  // Look at our peers
  this.ipfs.swarm.peers(function(err,r){
    var peers = r.Strings.forEach(function(s){
      var ss = s.split('/')
      var addr = ss[ss.length-1]
      // Try to see if they run IPFS Boards
      this.ipfs.cat(addr+'/ipfs-boards-version.txt',function(err,r){
        if(err) return console.log('Search Err:',err)
        replyAsObj(r,false,(_,res) => {
          // He does!
          // TODO: store found users in a list?
          console.log('Found user:',addr,'using version',res)
        })
      })
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
  this.ipfs.cat(url,function(err,res){
    if(err){
      done(err,{})
    } else {
      replyAsObj(res,true,done)
    }
  })
}

BoardsAPI.prototype.getBoardPosts(board,administratorID,done){
  // Returns a stream
}

BoardsAPI.prototype.getUserPosts(user,board,done){
  // Returns a stream
}

BoardsAPI.prototype.getComments(parent,board,done){
  // Returns a stream
}

BoardsAPI.prototype.createPost(post,board,done){

}

BoardsAPI.prototype.createComment(parent,comment,done){

}

BoardsAPI.prototype.createUpvote(parent,done){

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
