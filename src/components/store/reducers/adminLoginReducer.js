const defaultState = {
    login: false,
    valid: false,
    input: null,
    password: 'admin'
};

export function adminLoginReducer(state = defaultState, action) {
    switch (action.type) {
        case 'admin login':
            let valid = null;
            /admin/.test(state.input)
                ? valid = true
                : valid = false;
            return {...state, login: valid};
        case 'input password':
            return {...state, input: action.payload};
        default:
            return state;
    }
}
