
export function getBoardAddress(hash, name) {
    return '/orbitdb/' + hash + '/' + name
}

export function shortenAddress(address) {
    return address.replace(/^\/orbitdb/, '/b')
}