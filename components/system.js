export function getGlobalScope() {
  try {
    return window
  } catch (error) {
    return global
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
  const IPFS = await import('ipfs')
  data.ipfs = await IPFS.create() 
  return data.ipfs
}

export async function getOrbitDB() {
  const data = getGlobalData()
  if (data.orbitDb) return data.orbitDb
  const OrbitDB = await import('orbit-db').then(m => m.default)
  const BoardStore = await import('orbit-db-discussion-board').then(m => m.default)
  OrbitDB.addDatabaseType(BoardStore.type, BoardStore)
  data.orbitDb = await OrbitDB.createInstance(await getIPFS())
  data.boards = {}
  return data.orbitDb
}

export async function openBoard(id) {
  const data = getGlobalData()
  if (data.boards && data.boards[id]) return data.boards[id]
  const BoardStore = await import('orbit-db-discussion-board').then(m => m.default)
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
