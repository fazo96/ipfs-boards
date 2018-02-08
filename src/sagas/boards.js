import { put, call, fork, take } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { push } from 'react-router-redux'
import { open, connectDb } from '../orbitdb'
import { createdBoard, boardError } from '../actions/board'
import { shortenAddress } from '../utils/orbitdb'
import { UPDATE_BOARD } from '../actions/actionTypes'

export function* goToBoard({ board }){
    yield put(push(shortenAddress(board.address))) 
}

export function* updateBoard({ address }){
    const db = window.dbs[address]
    yield put({
        type: UPDATE_BOARD,
        address,
        posts: db.posts,
        metadata: db.metadata,
        syncRequestsReceived: db._stats.syncRequestsReceived,
        opLogLength: db._oplog.length
    }) 
}

export function* openBoard({ board }) {
    let db
    try {
        const metadata = board.title ? { title: board.title } : null
        db = yield call(open, board.address, metadata)
    } catch (error) {
        yield put(boardError(error))
    }
    if (db) {
        const address = db.address.toString()
        const dbInfo = { address }
        dbInfo.posts = db.posts
        dbInfo.metadata = db.metadata
        try {
            const channel = yield call(createDbEventChannel, db)
            yield fork(watchDb, channel)
            yield put(createdBoard(Object.assign({}, board, dbInfo)))
        } catch (error) {
            yield put({ type: 'ERROR', error })
        }
    }
}

function* watchDb(channel) {
    // Dispatches action coming from the channel, terminates when ORBITDB_CLOSE arrives
    let action
    while(!action || action.type !== 'ORBITDB_CLOSE') {
        action = yield take(channel)
        yield put(action)
    }
}

function createDbEventChannel(db) {
    return eventChannel(emitter => {
        connectDb(db, emitter)
        return () => db.close()
    })
}