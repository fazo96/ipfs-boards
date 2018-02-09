import { takeEvery } from 'redux-saga/effects'
import { OPEN_BOARD, OPENED_BOARD, ADD_POST, ORBITDB_REPLICATED, ORBITDB_WRITE, UPDATE_BOARD_METADATA } from '../actions/actionTypes'
import { openBoard, updateBoard, goToBoard, updateBoardMetadata } from './boards'
import { addPost } from './posts'

export default function* saga(){
   yield takeEvery(OPEN_BOARD, openBoard) 
   yield takeEvery(OPENED_BOARD, goToBoard) 

   yield takeEvery(ADD_POST, addPost) 
   yield takeEvery(UPDATE_BOARD_METADATA, updateBoardMetadata)

   yield takeEvery(ORBITDB_WRITE, updateBoard)
   yield takeEvery(ORBITDB_REPLICATED, updateBoard)
}