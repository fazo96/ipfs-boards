import { put, apply, call } from 'redux-saga/effects'
import { ipfsPut } from '../utils/ipfs'

export function* addPost({ boardId, post }) {
    const db = window.dbs[boardId]
    const { title, content } = post
    const multihash = yield call(ipfsPut, content)
    yield apply(db, db.addPost, [title, multihash])
}