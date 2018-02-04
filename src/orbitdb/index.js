import BoardStore from 'orbit-db-discussion-board'
import multihashes from 'multihashes'

export function isValidID(id) {
  try {
    if (typeof id === 'string' && multihashes.fromB58String(id)) return true
  } catch (error) {
    return false
  }
  return false
}

export async function open(id, metadata, options = {}) {
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
    create: id === undefined,
    type: BoardStore.type
  }
  let address
  if (!id) {
    address = 'board-v0'
  } else if (!isValidID(id)) {
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
