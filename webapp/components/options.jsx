module.exports = {
  get: function () {
    var opt
    var s = window.localStorage.getItem('ipfs-boards-settings')
    try {
      opt = JSON.parse(s)
    } catch (e) {
      // Do nothing
    }
    if (opt === null || opt === undefined) opt = { addr: 'localhost', port: 5001 }
    return opt
  }
}
