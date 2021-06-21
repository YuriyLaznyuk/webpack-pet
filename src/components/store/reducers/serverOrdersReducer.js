const defaultState = {
    orders: []
};

export function serverOrdersReducer(state = defaultState, action) {
    switch (action.type) {
        case 'get orders':
            return {...state, orders: action.payload};
        default:
            return state;
    }
}