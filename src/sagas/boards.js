import { put, call } from 'redux-saga/effects'
import { push } from 'react-router-redux'
import { open } from '../orbitdb'
import { creatingBoard, createdBoard, boardError } from '../actions/board'
import { getBoardIdFromAddress } from '../utils/orbitdb'

export function* createBoard({ board }) {
    yield put(creatingBoard(board))
    let db
    try {
        db = yield call(open, board.id)
    } catch (error) {
        yield put(boardError, error)
    }
    const address = db.address.toString()
    const dbInfo = {
        id: getBoardIdFromAddress(address),
        address
    }
    // TODO watch db status
    yield put(createdBoard(Object.assign({}, board, dbInfo)))
    yield put(push('/b/' + dbInfo.id + '/'))
}