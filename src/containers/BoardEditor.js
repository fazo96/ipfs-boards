
import React from 'react'
import { connect } from 'react-redux'
import BoardEditorForm from '../components/BoardEditorForm'
import { updateBoardMetadata } from '../actions/board'
import { getBoardAddress } from '../utils/orbitdb'

function BoardEditor({ boards, boardEditor, match, updateBoardMetadata }) {
    const { hash, name } = match.params
    const address = getBoardAddress(hash, name)
    const board = boards[address]
    return <BoardEditorForm
        board={board}
        address={address}
        updateBoardMetadata={updateBoardMetadata}
        {...boardEditor}
    />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards,
        boardEditor: state.boardEditor
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateBoardMetadata: (address, metadata) => dispatch(updateBoardMetadata(address, metadata))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BoardEditor)
