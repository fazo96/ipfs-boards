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
  const OrbitDB = await import('orbit-db')
  const BoardStore = await import('orbit-db-discussion-board')
  OrbitDB.addDatabaseType(BoardStore.type, BoardStore)
  data.orbitDb = await OrbitDB.createInstance(await getIPFS())
  data.boards = {}
  return data.orbitDb
}

export async function openBoard(id) {
  if (data.boards && data.boards[id]) return data.boards[id]
  const BoardStore = await import('orbit-db-discussion-board')
  const options = {
    type: BoardStore.type,
    create: true,
    write: ['*']
  }
  const orbitDb = await getOrbitDB()
  const db = await orbitDb.open(id)
  data.boards[id] = db
  return db
}
