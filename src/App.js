import React,{ useEffect } from 'react';
import { Provider} from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./components/store/index";
import MainPage from "./components/MainPage";
import "./App.scss";

function App(props) {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <MainPage/>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
