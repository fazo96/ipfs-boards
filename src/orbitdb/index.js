import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'
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

export async function start() {
  if (!window.ipfs) {
    window.ipfs = new IPFS({
      repo: 'ipfs-v6-boards-v0',
      EXPERIMENTAL: {
        pubsub: true
      }
    });
    await new Promise(resolve => {
      window.ipfs.on('ready', () => resolve())
    })
  }
  if (!window.orbitDb) {
    OrbitDB.addDatabaseType(BoardStore.type, BoardStore)
    window.orbitDb = new OrbitDB(window.ipfs)
  }
}

export async function open(address, metadata) {
  if (window.dbs && window.dbs[address]) return window.dbs[address]
  await start()
  const options = {
    type: BoardStore.type,
    create: true,
    write: ['*']
  }
  const db = await window.orbitDb.open(address, options)
  await db.load()
  if (metadata) {
    await db.updateMetadata(metadata)
  }
  if (!window.dbs) window.dbs = {}
  window.dbs[db.address.toString()] = db
  return db
}

export function connectDb(db, dispatch) {
  db.events.on('write', (dbname, hash, entry) => {
    dispatch({
        type: 'ORBITDB_WRITE',
        time: Date.now(),
        address: db.address.toString(),
        hash,
        entry
    })
  })
  db.events.on('replicated', address => {
    dispatch({
        type: 'ORBITDB_REPLICATED',
        time: Date.now(),
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
        have,
        time: Date.now(),
        replicationInfo: Object.assign({}, db._replicationInfo)
    })
  })
  db.events.on('replicate', address => {
    dispatch({
        type: 'ORBITDB_REPLICATE',
        time: Date.now(),
        address: db.address.toString()
    })
  })
  db.events.on('close', address => {
    dispatch({
        type: 'ORBITDB_CLOSE',
        time: Date.now(),
        address: db.address.toString()
    })
  })
  db.events.on('load', address => {
    dispatch({
        type: 'ORBITDB_LOAD',
        time: Date.now(),
        address: db.address.toString()
    })
  })
  db.events.on('load.progress', (address, hash, entry, progress, total) => {
    dispatch({
        type: 'ORBITDB_LOAD_PROGRESS',
        time: Date.now(),
        address: db.address.toString(),
        hash,
        entry,
        progress,
        total
    })
  })
}
