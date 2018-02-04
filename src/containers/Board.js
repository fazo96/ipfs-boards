import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import BoardComponent from '../components/Board'
import { createBoard } from '../actions/board'

class Board extends Component {

    componentDidMount() {
        const { boards, match } = this.props
        if (!boards[match.params.boardId]) {
            this.props.openBoard(match.params.boardId)
        }
    }

    render() {
        const { boards, match } = this.props
        const id = match.params.boardId
        const board = boards[id]
        if (board) {
            return <BoardComponent {...board} />
        } else {
            return <div>Opening this board...</div>
        }
    }
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

function mapDispatchToProps(dispatch){
    return {
        openBoard: id => dispatch(createBoard(id))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board)
