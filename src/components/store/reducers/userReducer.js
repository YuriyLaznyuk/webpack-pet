const defaultState = {
    currentUser: {},
    isAuth: false,
    name: '',
    email: '',
    password: '',
    emailLogin:'',
    passwordLogin:''
};

export function userReducer(state = defaultState, action) {
    switch (action.type) {
        case 'user sign up':
            return {...state, [action.payload.name]: action.payload.value};
        case 'user log in':
            return {...state,[action.payload.name]:action.payload.value}
        case 'set user':
            return {...state,isAuth:true,currentUser: action.payload}
        case 'log out':
            //delete token
            localStorage.removeItem('token')
            return {...state,isAuth: false,currentUser:{} }
        case 'isAuth false':
            return {...state,isAuth: false}
        default:
            return state;
    }
}
