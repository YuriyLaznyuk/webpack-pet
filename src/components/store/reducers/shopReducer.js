const defaultState = {
    users: '',
    products: '',
    basket: '',
    currentList: [],
    numberPage: ''
};

export function shopReducer(state = defaultState, action) {
    switch (action.type) {
        case "json users":
            return {...state, users: action.payload};
        case "json products":
            return {...state, products: action.payload};
        case "json basket":
            return {...state, basket: action.payload};
        case "current list products":
            return {...state, currentList: action.payload.list,
                numberPage: action.payload.page};
        default:
            return state;
    }
}
