import { takeEvery } from 'redux-saga/effects'
import { CREATE_BOARD } from '../actions/actionTypes'
import { createBoard } from './boards'

export default function* saga(){
   yield takeEvery(CREATE_BOARD, createBoard) 
}