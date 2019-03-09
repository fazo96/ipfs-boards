import { call } from 'redux-saga/effects'
import { goToBoard } from './boards';

export function* addPost({ address, post }) {
    const db = window.dbs[address]
    const { title, text } = post
    yield call([db, db.addPost], { title, text })
    yield goToBoard({ board: { address, redirect: true } });
    // TODO: goto post
}

export function* editPost({ address, postId, post }) {
    const db = window.dbs[address]
    const { title, text } = post
    yield call([db, db.updatePost], postId, { title, text })
    yield goToBoard({ board: { address, redirect: true } });
    // TODO: goto post
}