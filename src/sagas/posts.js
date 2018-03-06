import { apply, call } from 'redux-saga/effects'
import { ipfsPut } from '../utils/ipfs'
import { goToBoard } from './boards';

export function* addPost({ address, post }) {
    const db = window.dbs[address]
    const { title, text } = post
    yield apply(db, db.addPost, { title, text })
    yield goToBoard({ board: { address } });
    // TODO: goto post
}

export function* editPost({ address, postId, post }) {
    const db = window.dbs[address]
    const { title, text } = post
    yield apply(db, db.updatePost, [postId, { title, text }])
    yield goToBoard({ board: { address } });
    // TODO: goto post
}

export function* editPost({ address, postId, post }) {
    const db = window.dbs[address]
    const { title, text } = post
    yield apply(db, db.updatePost, [postId, { title, text }])
    yield goToBoard({ board: { address } });
    // TODO: goto post
}