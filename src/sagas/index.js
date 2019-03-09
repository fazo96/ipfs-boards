import { takeEvery, put, call } from 'redux-saga/effects'
import {
    OPEN_BOARD,
    OPENED_BOARD,
    CLOSE_BOARD,
    ADD_POST,
    ORBITDB_REPLICATED,
    ORBITDB_WRITE,
    UPDATE_BOARD_METADATA
} from '../actions/actionTypes'
import { openBoard, updateBoard, goToBoard, updateBoardMetadata, closeBoard } from './boards'
import { addPost } from './posts'
import { openPreviousBoards, saveSaga } from './persistence'

export default function* saga(){
   yield takeEvery(OPEN_BOARD, openBoard) 
   yield takeEvery(OPENED_BOARD, goToBoard) 
   yield takeEvery(OPENED_BOARD, saveSaga) 
   yield takeEvery(CLOSE_BOARD, closeBoard) 

   yield takeEvery(ADD_POST, addPost) 
   yield takeEvery(UPDATE_BOARD_METADATA, updateBoardMetadata)

   yield takeEvery(ORBITDB_WRITE, updateBoard)
   yield takeEvery(ORBITDB_REPLICATED, updateBoard)

   yield openPreviousBoards()
}