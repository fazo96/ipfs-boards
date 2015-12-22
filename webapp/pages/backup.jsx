var React = require('react')
var Icon = require('icon.jsx')

module.exports = React.createClass({
  render () {
    return <div className="thin center-block">
      <div className="text-center">
        <h1><Icon name="database" className="light" /></h1>
        <h3 className="">Backup and Restore</h3>
      </div>
      <p>A user's profile is just a folder with a bunch of other files and
      folders. This makes it very easy to create backups of anyone's profile,
      not just yours.</p>
      <p>Restoring is also very easy: once you have the profile folder, just
      add it to IPFS and then use the resulting hash to restore your profile.
      Only restoring manually is possible, because <b>I haven't implemented
      assisted restore yet</b> but that's coming soon.</p>
      <div className="text-center">
        <h1><Icon name="download" className="light" /></h1>
        <h3 className="">Backing Up</h3>
      </div>
      <p>Get the IPNS address of the user you want to back up. For example, while visiting
      <code>/@userid</code>, <code>userid</code> would be what you're looking for.</p>
      <p>If you have a profile, click on the <Icon name="user"/> icon in the top bar to view your address.</p>
      <p>Make sure you are running a full <code>go-ipfs</code> node on your machine. Then, run this command: <code>ipfs get /ipns/userid/ipfs-boards-profile/</code> where <code>userid</code> is the target user's IPNS address.</p>
      <p>A folder named <code>ipfs-boards-profile</code> will be created in the current working directory, containing the <b>full profile</b> with everything that is being published by the user. <b>It's that simple</b>.</p>
      <div className="text-center">
        <h1><Icon name="upload" className="light" /></h1>
        <h3 className="">Restoring</h3>
      </div>
      <p>Start the IPFS node you want to use to publish your profile.</p>
      <p>Get the IPFS hash of the <code>ipfs-boards-profile</code> folder that you want to use.</p>
      <p>If you have a folder on your system, you can add it ipfs using <code>ipfs add -r folder</code> where <code>folder</code> is the path to your folder.</p>
      <p>Run this command to <b>dangerously delete</b> any existing profile: <code>ipfs files rm /ipfs-boards-profile</code></p>
      <p>Run this command to copy the new profile in place: <code>ipfs files cp /ipfs/hash /ipfs-boards-profile</code></p>
      <p>Now check the hash of your <code>mfs</code> by running <code>ipfs files stat /</code>. Also check using <code>ipfs files ls /</code> to see that there's nothing you wouldn't want to publish.</p>
      <p>Publish your <code>mfs</code> containing your profile to IPNS using <code>ipfs name publish /ipfs/hash</code> where hash is the hash returned by the <code>ipfs files stat /</code> command</p>
      <p><b>Note</b>: soon, you'll be able to restore from IPFS just by clicking a button!</p>
  </div>
  }
})
