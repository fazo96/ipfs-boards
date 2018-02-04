
export function getBoardIdFromAddress(address) {
    const match = /\/orbitdb\/(.+)\//.exec(address)
    if (match[1]) return match[1]
    return undefined
}