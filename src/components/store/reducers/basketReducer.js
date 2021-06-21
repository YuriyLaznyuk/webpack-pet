const defaultState = {
    idOrder: '',
    idUser: '',
    orderDate: '',
    indexProduct: '',
    products: [],

};

export function basketReducer(state = defaultState, action) {
    switch (action.type) {
        case 'add product in basket':
            let products = state.products.concat([{
                idProduct: action.payload.idProduct,
                countProduct: 1,
                priceProduct: action.payload.priceProduct,
            }]);
            return {
                ...state,
                idOrder: action.payload.idOrder,
                idUser: action.payload.idUser,
                orderDate: action.payload.orderDate,
                products: products
            };
        case 'add product in basket next':
            let nextProduct=state.products.concat([{
                idProduct: action.payload.idProduct,
                countProduct: 1,
                priceProduct: action.payload.priceProduct,
            }]);
            return {...state, products: nextProduct};
        case 'add count':
            state.products[action.payload.index].countProduct=action.payload.count;
            return {...state};
        case 'delete product':
            state.products.splice(action.payload.index,1);
            return {...state};
        case 'clear basket redux':
            return {...state, idOrder: '', idUser: '', orderDate: '', indexProduct:'',
                products: []}
        default:
            return state;
    }
}
