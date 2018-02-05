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
  try {
    const db = await window.orbitDb.open(address, Object.assign(defaultOptions, options))
    await db.load()
    if (metadata && defaultOptions.create) {
      await db.updateMetadata(metadata)
    }
    if (!window.dbs) window.dbs = {}
    window.dbs[getBoardIdFromAddress(db.address.toString())] = db
    return db
  } catch (error) {
    console.log(error)
  }
}

export function connectDb(db, dispatch) {
  db.events.on('write', (dbname, hash, entry) => {
    dispatch({
        type: 'ORBITDB_WRITE',
        id: getBoardIdFromAddress(db.address.toString()),
        hash,
        entry
    })
  })
  db.events.on('replicated', address => {
    dispatch({
        type: 'ORBITDB_REPLICATED',
        id: getBoardIdFromAddress(db.address.toString())
    })
  })
  db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
    dispatch({
        type: 'ORBITDB_REPLICATE_PROGRESS',
        id: getBoardIdFromAddress(db.address.toString()),
        hash,
        entry,
        progress,
        have
    })
  })
  db.events.on('replicate', address => {
    dispatch({
        type: 'ORBITDB_REPLICATE',
        id: getBoardIdFromAddress(db.address.toString())
    })
  })
  db.events.on('close', address => {
    dispatch({
        type: 'ORBITDB_CLOSE',
        id: getBoardIdFromAddress(db.address.toString())
    })
  })
  db.events.on('load', address => {
    dispatch({
        type: 'ORBITDB_LOAD',
        id: getBoardIdFromAddress(db.address.toString())
    })
  })
  db.events.on('load.progress', (address, hash, entry, progress, total) => {
    dispatch({
        type: 'ORBITDB_LOAD_PROGRESS',
        id: getBoardIdFromAddress(db.address.toString()),
        hash,
        entry,
        progress,
        total
    })
  })
}
