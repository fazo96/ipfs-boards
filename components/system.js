export function getGlobalScope() {
  try {
    return window
  } catch (error) {
    return global
  }
}

export function isServer() {
  try {
    window.document
    return false
  } catch (error) {
    return true
  }
}

export function getGlobalData() {
  const scope = getGlobalScope()
  if (!scope.ipfsBoards) scope.ipfsBoards = {}
  return scope.ipfsBoards
}

export async function getIPFS() {
  const data = getGlobalData()
  if (data.ipfs) return data.ipfs
  if (!data.ipfsPromise) {
    const IPFS = await import(/* webpackChunkName: "ipfs" */ 'ipfs')
    data.ipfsPromise = IPFS.create() 
  }
  data.ipfs = await data.ipfsPromise
  delete data.ipfsPromise
  return data.ipfs
}

export async function getOrbitDB() {
  const data = getGlobalData()
  if (data.orbitDb) return data.orbitDb
  const ipfs = await getIPFS()
  if (!data.orbitDbPromise) {
    const OrbitDB = await import(/* webpackChunkName: "orbit-db" */ 'orbit-db').then(m => m.default)
    const BoardStore = await import(/* webpackChunkName: "orbit-db-discussion-board" */ 'orbit-db-discussion-board').then(m => m.default)
    OrbitDB.addDatabaseType(BoardStore.type, BoardStore)
    data.orbitDbPromise = OrbitDB.createInstance(ipfs)
  }
  data.orbitDb = await data.orbitDbPromise
  delete data.orbitDbPromise
  if (!data.boards) data.boards = {}
  return data.orbitDb
}

export async function openBoard(id) {
  const data = getGlobalData()
  if (data.boards && data.boards[id]) return data.boards[id]
  const BoardStore = await import(/* webpackChunkName: "orbit-db-discussion-board" */ 'orbit-db-discussion-board').then(m => m.default)
  const options = {
    type: BoardStore.type,
    create: true,
    write: ['*']
  }
  const orbitDb = await getOrbitDB()
  const db = await orbitDb.open(id, options)
  data.boards[id] = db
  await db.load()
  return db
}

const defaultLocalStorage = {
  favouriteBoards: ['general', 'test']
}

export function getLocalStorage() {
  try {
    return window.localStorage
  } catch (error) {
    const data = getGlobalData()
    if (!data.localStorage) data.localStorage = { ...defaultLocalStorage }
    return {
      getItem: name => data.localStorage[name],
      setItem: (name, value) => data.localStorage[name] = value,
      removeItem: name => delete data.localStorage[name],
    }
  }
}

export async function getIPFSPeers() {
  const data = getGlobalData()
  return data.ipfs ? (await data.ipfs.swarm.peers()).map(x => x.peer._idB58String) : []
}

export async function getPubsubInfo() {
  const data = getGlobalData()
  if (!data.ipfs) return {}
  const rooms = await data.ipfs.pubsub.ls()
  const pubsubInfo = {}
  for (const room of rooms) {
    pubsubInfo[room] = await data.ipfs.pubsub.peers(room)
  }
  return pubsubInfo
}

export function getInfo() {
  const data = getGlobalData()
  return data.info
}

export async function refreshInfo() {
  const data = getGlobalData()
  data.info = {
    isServer: isServer(),
    ipfsReady: Boolean(data.ipfs),
    orbitDbReady: Boolean(data.orbitDb),
    openBoards: Object.keys(data.boards || {}),
    ipfsPeers: await getIPFSPeers(),
    pubsub: await getPubsubInfo()
  }
  return data.info
}