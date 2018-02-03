import React from 'react'
import { connect } from 'react-redux'
import BoardsComponent from '../components/Boards'

function Boards({ boards }) {
    return <BoardsComponent boards={boards} />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

function mapDispatchToProps(dispatch){
    return {
        
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Boards)
