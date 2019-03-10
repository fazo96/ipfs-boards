export async function createIPFS() {
  const IPFS = (await import('ipfs')).default;
  const node = new IPFS({
    EXPERIMENTAL: {
      pubsub: true,
    },
  });
  return new Promise(resolve => node.on('ready', () => resolve(node)));
}

export async function getIPFS() {
  let ipfs = window.ipfs_enabled || window.ipfs;
  if (!ipfs) {
    ipfs = await createIPFS();
  } else if (typeof ipfs.enable === 'function') {
    // support window.ipfs from IPFS companion
    // https://github.com/ipfs-shipyard/ipfs-companion/blob/master/docs/window.ipfs.md
    try {
      ipfs = await window.ipfs.enable({
        commands: ['object', 'files', 'pubsub'],
      });
    } catch (error) {
      ipfs = await createIPFS();
    }
  }
  window.ipfs_enabled = ipfs;
  return ipfs;
}

export async function ipfsPut(content) {
  const ipfs = await getIPFS();
  const obj = {
    content: Buffer.from(content),
    path: '/',
  };
  const response = await ipfs.files.add(obj);
  return response[0].hash;
}

export async function readText(multihash) {
  const ipfs = await getIPFS();
  const buffer = await ipfs.object.get(multihash);
  return buffer.toString('utf-8');
}

export async function getStats() {
  const ipfs = await getIPFS();
  const orbitDb = window.orbitDb;
  const dbs = {};
  const stats = {};
  if (ipfs && ipfs.isOnline()) {
    stats.ipfsLoaded = true;
    const peers = await ipfs.swarm.peers();
    const id = await ipfs.id();
    stats.peers = peers.map(p => p.peer.id._idB58String);
    stats.id = id.id;
  } else {
    stats.ipfsLoaded = false;
  }
  if (stats.ipfsLoaded && orbitDb) {
    stats.orbitDbLoaded = true;
    stats.pubKey = await orbitDb.key.getPublic('hex');
    Object.values(window.dbs || {}).forEach((db) => {
      const writeable = db.access.write.indexOf('*') >= 0 || db.access.write.indexOf(stats.pubKey) >= 0;
      const dbInfo = {
        opLogLength: db._oplog.length,
        access: {
          admin: db.access.admin,
          read: db.access.read,
          write: db.access.write,
          writeable,
        },
        peers: [],
      };
      const subscription = orbitDb._pubsub._subscriptions[db.address];
      if (subscription && subscription.room) {
        dbInfo.peers = [...(subscription.room._peers || [])];
      }
      dbs[db.address] = dbInfo;
    });
  } else {
    stats.orbitDbLoaded = false;
  }
  stats.dbs = dbs;
  return stats;
}
