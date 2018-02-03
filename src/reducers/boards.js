
function getInitialState() {
    return {
        boards: []
    }
}

export default function BoardsReducer(state = getInitialState(), action) {
    switch (action.type) {
        default:
            return state;
    }
}