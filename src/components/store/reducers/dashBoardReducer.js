const defaultState = {
    productId: "",
    productName: "",
    productDescription: "",
    productPrice: "",
    productCategory: "",
    productImg: "",
    addProduct: false,
    editProduct: false,
    editIndex: null,
    addFlag: false,
    editFlag: false
};

export function dashBoardReducer(state = defaultState, action) {
    switch (action.type) {
        case 'add product':
            return {...state, addProduct: true};
        case 'cancel product':
            return {...state, addProduct: false, editProduct: false, editIndex: null};
        case 'input product':
            return {...state, [action.payload.name]: action.payload.value};
        case 'input file':
            return {...state, productImg: action.payload.file};
        case 'edit product':
            return {...state, editProduct: true, addProduct: true, editIndex: action.payload};
        case 'add flag':
            return {...state, addFlag: !state.addFlag};
        case 'edit flag':
            return {...state, editFlag: !state.editFlag};
        default:
            return state;
    }
}
