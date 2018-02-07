import React from 'react'
import { connect } from 'react-redux'
import BoardForm from '../components/BoardForm'
import { openBoard } from '../actions/board'

function BoardEditor(props) {
    return <BoardForm {...props} />
}

function mapStateToProps(state){
    return {
        opening: state.boardEditor.opening
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
