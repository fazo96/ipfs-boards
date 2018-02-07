import React from 'react'
import { connect } from 'react-redux'
import BoardForm from '../components/BoardForm'
import { openBoard } from '../actions/board'

function BoardEditor({ board, openBoard }) {
    return <BoardForm board={board} onSave={openBoard} />
}

function mapStateToProps(state){
    return {
        board: state.boardEditor.board
    }
}

function mapDispatchToProps(dispatch) {
    return {
        openBoard: board => dispatch(openBoard(board))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BoardEditor)
