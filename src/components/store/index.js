import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {shopReducer} from "./reducers/shopReducer";
import {adminLoginReducer} from "./reducers/adminLoginReducer";
import {dashBoardReducer} from "./reducers/dashBoardReducer";
import {userReducer} from "./reducers/userReducer";
import {basketReducer} from "./reducers/basketReducer";
import {serverOrdersReducer} from "./reducers/serverOrdersReducer";

const rootReducers = combineReducers({
    shop: shopReducer,
    adminLogin: adminLoginReducer,
    dashboard: dashBoardReducer,
    user: userReducer,
    basket: basketReducer,
    orders: serverOrdersReducer

});

export const store = createStore(rootReducers, composeWithDevTools(applyMiddleware(thunk)));
