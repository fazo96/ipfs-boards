// Custom event emitter for boards-api

var EventEmitter = function(){
  this.listeners = {}
}

EventEmitter.prototype.on = function(name,handler){
  if(this.listeners[name] === undefined)
    this.listeners[name] = []
  else if(handler && handler.apply && this.listeners[name].indexOf(handler) < 0)
    this.listeners[name].push(handler)
}

EventEmitter.prototype.emit = function(name,arg){
  var args = []
  for(var a in arguments) if(a > 0) args.push(arguments[a])
  if(this.listeners[name]){
    for(var i in this.listeners[name]){
      var listener = this.listeners[name][i]
      if(listener && listener.apply) listener.apply(this,args)
    }
  }
}

module.exports = EventEmitter
