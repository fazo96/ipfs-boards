import { ADD_POST } from '../actions/actionTypes';

function getInitialState() {
  return {
    post: {
      title: '',
      content: '',
    },
  };
}

export default function (state = getInitialState(), action) {
  switch (action.type) {
    case ADD_POST:
      return Object.assign({}, state, { post: action.post });
    default:
      return state;
  }
}
