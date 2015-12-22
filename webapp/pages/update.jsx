var React = require('react')
var Icon = require('icon.jsx')

module.exports = React.createClass({
  render () {
    var gateway = window.location.pathname.indexOf('/ipfs/') === 0 || window.location.pathname.indexOf('/ipns/') === 0
    return <div>
      <div className="text-center">
        <h1><Icon name="history" className="light" /></h1>
        <h3 className="light">Version Center</h3>
      </div>
      <p>This page lets you reach the latest version
      of the app from any older versions. In the future, you will be able to manage
      and easily access any old version of the app too, for compatibility
      and archival reasons.</p>
      <p><b>You're free to keep going</b>, but if you want the latest updates as
      soon as they are published, you can click the following button, that will
      bring you to an IPFS URL that always points to the latest version.</p>
      <div className="buttons">
        <a className="button button-primary" href={gateway ? '/ipns/boards.ydns.eu' : 'http://ipfs.ydns.eu/ipns/boards.ydns.eu'}>Update</a>
      </div>
    </div>
  }
})
