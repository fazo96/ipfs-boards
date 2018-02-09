import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import BoardsComponent from '../components/Boards'
import WithStats from './WithStats'
import { closeBoard } from '../actions/board'

const WrappedComponent = WithStats(BoardsComponent)

function Boards({ boards, createBoard, closeBoard }) {
    return <WrappedComponent
        boards={boards}
        createBoard={createBoard}
        closeBoard={closeBoard}
    />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

function mapDispatchToProps(dispatch){
    return {
       createBoard: () => dispatch(push('/b/new')),
       closeBoard: address => dispatch(closeBoard(address)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Boards)
