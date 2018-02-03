import BoardStore from './BoardStore'

export async function open(address, options = {}) {
  if (!window.ipfs) {
    window.ipfs = await import('ipfs')
  }
  if (!window.orbitDb) {
    const OrbitDB = await import('orbit-db')
    window.orbitDb = new OrbitDB(window.ipfs)
    window.orbitDb.addDatabaseType(BoardStore.type, BoardStore)
  }
  const defaultOptions = {
    create: true,
    type: BoardStore.type
  }
  return await window.orbitDb.open(address, Object.assign(defaultOptions, options))
}
