import { put, call } from 'redux-saga/effects'
import { open } from '../orbitdb'
import { creatingBoard, createdBoard } from '../actions/board'

export function* createBoard({ board }) {
    yield put(creatingBoard(board))
    const db = yield call(open, board.address)
    const dbInfo = {
        address: db.address.toString()
    }
    // TODO watch db status
    yield put(createdBoard(Object.assign({}, board, dbInfo)))
}