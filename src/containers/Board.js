import React from 'react'
import { connect } from 'react-redux'
import BoardComponent from '../components/Board'
import { getBoardAddress } from '../utils/orbitdb'

function Board({ location, match, boards }) {
    const { hash, name } = match.params
    return <BoardComponent {...boards[getBoardAddress(hash, name)]} />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

export default connect(
    mapStateToProps
)(Board)
