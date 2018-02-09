
export function save(){
    const obj = {
        addresses: Object.keys(window.dbs || {})
    }
    localStorage.setItem('ipfs-boards-v0', JSON.stringify(obj))
}

export function load(){
    const str = localStorage.getItem('ipfs-boards-v0')
    try {
        return JSON.parse(str) || {};
    } catch (error) {
        return {}
    }
}