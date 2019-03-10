import { call, put } from 'redux-saga/effects';
import { openBoard } from '../actions/board';
import { save, load } from '../utils/persistence';

export function* openPreviousBoards() {
  const data = yield call(load);
  if (Array.isArray(data.addresses)) {
    for (const address of data.addresses) {
      yield put(openBoard({ address, redirect: false }));
    }
  }
}

export function* saveSaga() {
  yield call(save);
}
