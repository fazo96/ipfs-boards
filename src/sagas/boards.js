import { put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { open, connectDb } from '../orbitdb'
import { creatingBoard, createdBoard, boardError } from '../actions/board'
import { getBoardIdFromAddress } from '../utils/orbitdb'

export function* createBoard({ board }) {
    yield put(creatingBoard(board))
    let db
    try {
        db = yield call(open, board.id, {
            title: board.title
        })
    } catch (error) {
        yield put(boardError, error)
    }
    const address = db.address.toString()
    const dbInfo = {
        id: getBoardIdFromAddress(address),
        address
    }
    // TODO: use https://redux-saga.js.org/docs/advanced/Channels.html to handle orbitdb events
    // yield call(connectDb(db, dispatch))
    yield put(createdBoard(Object.assign({}, board, dbInfo)))
    yield put(push('/b/' + dbInfo.id + '/'))
}