import React from 'react'
import { connect } from 'react-redux'
import BoardForm from '../components/BoardForm'
import { createBoard } from '../actions/board'

function BoardEditor({ board, createBoard }) {
    return <BoardForm board={board} onSave={createBoard} />
}

function mapStateToProps(state){
    return {
        board: state.boardEditor.board
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createBoard: board => dispatch(createBoard(board))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BoardEditor)
