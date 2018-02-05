import { takeEvery } from 'redux-saga/effects'
import { CREATE_BOARD, ADD_POST, ORBITDB_REPLICATED, ORBITDB_WRITE } from '../actions/actionTypes'
import { createBoard, updateBoard } from './boards'
import { addPost } from './posts'

export default function* saga(){
   yield takeEvery(CREATE_BOARD, createBoard) 
   yield takeEvery(ADD_POST, addPost) 
   yield takeEvery(ORBITDB_WRITE, updateBoard)
   yield takeEvery(ORBITDB_REPLICATED, updateBoard)
}