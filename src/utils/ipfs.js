import multihashes from 'multihashes'

export async function ipfsPut(content) {
    const dagNode = await window.ipfs.object.put(Buffer.from(content))
    return multihashes.toB58String(dagNode.multihash)
}