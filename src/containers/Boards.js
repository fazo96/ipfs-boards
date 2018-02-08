import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import BoardsComponent from '../components/Boards'
import WithStats from './WithStats'

const WrappedComponent = WithStats(BoardsComponent)

function Boards({ boards, createBoard }) {
    return <WrappedComponent boards={boards} createBoard={createBoard} />
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
