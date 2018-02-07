import { takeEvery } from 'redux-saga/effects'
import { OPEN_BOARD, ADD_POST, ORBITDB_REPLICATED, ORBITDB_WRITE } from '../actions/actionTypes'
import { openBoard, updateBoard } from './boards'
import { addPost } from './posts'

export default function* saga(){
   yield takeEvery(OPEN_BOARD, openBoard) 
   yield takeEvery(ADD_POST, addPost) 
   yield takeEvery(ORBITDB_WRITE, updateBoard)
   yield takeEvery(ORBITDB_REPLICATED, updateBoard)
}