import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import BoardsComponent from '../components/Boards'

function Boards({ boards, createBoard }) {
    return <BoardsComponent boards={boards} createBoard={createBoard} />
}

function mapStateToProps(state){
    return {
        boards: state.boards.boards
    }
}

function mapDispatchToProps(dispatch){
    return {
       createBoard: () => dispatch(push('/b/new')) 
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Boards)
