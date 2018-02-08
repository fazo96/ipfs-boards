import React from 'react'
import { connect } from 'react-redux'
import BoardComponent from '../components/Board'
import { getBoardAddress } from '../utils/orbitdb'

function Board({ stats, location, match, boards }) {
    const { hash, name } = match.params
    const address = getBoardAddress(hash, name)
    const boardStats = stats.dbs[address] || {}
    return <BoardComponent stats={boardStats} {...boards[address]} />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

export default connect(
    mapStateToProps
)(Board)
