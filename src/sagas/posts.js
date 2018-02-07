import { apply, call } from 'redux-saga/effects'
import { ipfsPut } from '../utils/ipfs'

export function* addPost({ address, post }) {
    const db = window.dbs[address]
    const { title, content } = post
    const multihash = yield call(ipfsPut, content)
    yield apply(db, db.addPost, [title, multihash])
}