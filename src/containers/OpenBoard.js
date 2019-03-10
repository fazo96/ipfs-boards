import React from 'react';
import { connect } from 'react-redux';
import OpenBoardForm from '../components/OpenBoardForm';
import { openBoard } from '../actions/board';

function OpenBoard(props) {
  return <OpenBoardForm {...props} />;
}

function mapStateToProps(state) {
  return {
    opening: state.openBoard.opening,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openBoard: board => dispatch(openBoard(board)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenBoard);
