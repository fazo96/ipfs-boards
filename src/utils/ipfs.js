export async function ipfsPut(content) {
    const obj = {
        content: Buffer.from(content),
        path: '/'
    }
    const response = await window.ipfs.files.add(obj)
    return response[0].hash
}