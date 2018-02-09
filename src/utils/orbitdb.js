
export function getBoardAddress(hash, name) {
    return '/orbitdb/' + hash + '/' + name
}

export function shortenAddress(address) {
    return address.replace(/^\/orbitdb/, '/b')
}

export function closeBoard(address) {
    const db = window.dbs[address]
    delete window.dbs[address]
    if (db && db.close) db.close()
}