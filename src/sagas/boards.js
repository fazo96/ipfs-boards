import {
  put, call, fork, take,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { push } from 'connected-react-router';
import { open, connectDb } from '../orbitdb';
import { createdBoard } from '../actions/board';
import { shortenAddress, closeBoard as closeOrbitDBBoard } from '../utils/orbitdb';
import { UPDATE_BOARD } from '../actions/actionTypes';
import { saveSaga } from './persistence';

export function* goToBoard({ board }) {
  if (board.redirect) {
    yield put(push(shortenAddress(board.address)));
  }
}

export function* updateBoard({ address }) {
  const db = window.dbs[address];
  yield put({
    type: UPDATE_BOARD,
    address,
    posts: db.posts,
    metadata: Object.assign({}, db._index._index.metadata), // TODO: fix in lib and use db.metadata
  });
}

export function* closeBoard({ address }) {
  yield call(closeOrbitDBBoard, address);
  yield saveSaga();
}

export function* updateBoardMetadata({ address, metadata }) {
  const db = window.dbs[address];
  if (db) {
    yield call([db, db.updateMetadata], [metadata]);
    yield goToBoard({ board: { address } });
  } else {
    yield put({ type: 'ERROR', error: `${address} not found` });
  }
}

export function* openBoard({ board }) {
  let db;
  try {
    const metadata = board.title ? { title: board.title } : null;
    db = yield call(open, board.address, metadata);
  } catch (error) {
    yield put({ type: 'ERROR', error });
  }
  if (db) {
    const address = db.address.toString();
    const dbInfo = { address };
    dbInfo.posts = db.posts;
    dbInfo.metadata = Object.assign({}, db._index._index.metadata); // TODO: fix in lib and use db.metadata
    dbInfo.name = db.dbname;
    try {
      const channel = yield call(createDbEventChannel, db);
      yield fork(watchDb, channel);
      yield put(createdBoard(Object.assign({ redirect: !!board.redirect }, board, dbInfo)));
    } catch (error) {
      yield put({ type: 'ERROR', error });
    }
  }
}

function* watchDb(channel) {
  // Dispatches action coming from the channel, terminates when ORBITDB_CLOSE arrives
  let action;
  while (!action || action.type !== 'ORBITDB_CLOSE') {
    action = yield take(channel);
    yield put(action);
  }
}

function createDbEventChannel(db) {
  return eventChannel((emitter) => {
    connectDb(db, emitter);
    return () => db.close();
  });
}
