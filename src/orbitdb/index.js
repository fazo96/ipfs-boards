import BoardStore from 'orbit-db-discussion-board'
import multihashes from 'multihashes'
import { getBoardIdFromAddress } from '../utils/orbitdb'

export function isValidID(id) {
  try {
    if (typeof id === 'string' && multihashes.fromB58String(id)) return true
  } catch (error) {
    return false
  }
  return false
}

export async function open(address, metadata) {
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
  const options = {
    type: BoardStore.type,
    create: true
  }
  try {
    const db = await window.orbitDb.open(address, options)
    await db.load()
    if (metadata) {
      await db.updateMetadata(metadata)
    }
    if (!window.dbs) window.dbs = {}
    window.dbs[db.address.toString()] = db
    return db
  } catch (error) {
    console.log(error)
  }
}

export function connectDb(db, dispatch) {
  db.events.on('write', (dbname, hash, entry) => {
    dispatch({
        type: 'ORBITDB_WRITE',
        address: db.address.toString(),
        hash,
        entry
    })
  })
  db.events.on('replicated', address => {
    dispatch({
        type: 'ORBITDB_REPLICATED',
        address: db.address.toString()
    })
  })
  db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
    dispatch({
        type: 'ORBITDB_REPLICATE_PROGRESS',
        address: db.address.toString(),
        hash,
        entry,
        progress,
        have
    })
  })
  db.events.on('replicate', address => {
    dispatch({
        type: 'ORBITDB_REPLICATE',
        address: db.address.toString()
    })
  })
  db.events.on('close', address => {
    dispatch({
        type: 'ORBITDB_CLOSE',
        address: db.address.toString()
    })
  })
  db.events.on('load', address => {
    dispatch({
        type: 'ORBITDB_LOAD',
        address: db.address.toString()
    })
  })
  db.events.on('load.progress', (address, hash, entry, progress, total) => {
    dispatch({
        type: 'ORBITDB_LOAD_PROGRESS',
        address: db.address.toString(),
        hash,
        entry,
        progress,
        total
    })
  })
}
