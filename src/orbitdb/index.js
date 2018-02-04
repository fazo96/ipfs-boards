import BoardStore from 'orbit-db-discussion-board'

export async function open(address, metadata, options = {}) {
  if (!window.ipfs) {
    const IPFS = await import('ipfs')
    window.ipfs = new IPFS({
      repo: 'ipfs-v6-boards-v0',
      EXPERIMENTAL: {
          pubsub: true
      },
      config: {
        Addresses: {
          Swarm: [
            '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            '/dns4/ws-star-signal-1.servep2p.com/tcp/443/wss/p2p-websocket-star',
            '/dns4/ws-star-signal-2.servep2p.com/tcp/443/wss/p2p-websocket-star'
          ]
        }
      }
    });
    await new Promise(fullfill => {
      window.ipfs.on('ready', () => fullfill())
    })
  }
  if (!window.orbitDb) {
    const OrbitDB = await import('orbit-db')
    OrbitDB.addDatabaseType(BoardStore.type, BoardStore)
    window.orbitDb = new OrbitDB(window.ipfs)
  }
  const defaultOptions = {
    create: address === undefined,
    type: BoardStore.type
  }
  if (!address) {
    address = 'board-v0'
  } else if (!address.indexOf('/orbitdb/') < 0 || address.indexOf('/board-v0') < 0) {
    throw new Error('invalid address')
  }
  const db = await window.orbitDb.open(address, Object.assign(defaultOptions, options))
  if (metadata) {
    await db.updateMetadata(metadata)
  }
  if (!window.dbs) window.dbs = {}
  window.dbs[db.address.toString()] = db
  return db
}
