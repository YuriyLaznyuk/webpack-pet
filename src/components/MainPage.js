import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {
    Switch,
    Route,
    useRouteMatch,
    Link,
    NavLink,
    BrowserRouter,
    Redirect,
    useLocation
} from "react-router-dom";
import Main from "./Main";
import AdminLogin from "./additional/admin/AdminLogin";
import AdminDashBoard from "./additional/admin/AdminDashBoard";
import Registration from "./Registration";
import Authorization from "./Authorization";
import Basket from "./Basket";
import "./style/mainPage.scss";

function MainPage(props) {
    const {login} = useSelector(state => state.adminLogin);
    const {isAuth, currentUser} = useSelector(state => state.user);
    const {products} = useSelector(state => state.basket);
    const dispatch = useDispatch();
    console.log(useRouteMatch());
    const host = window.location.origin;

    function authToken() {
        fetch(host + '/api/users/auth', {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
            .then(res => res.json())
            .then(json => {
                if (json.token) {
                    dispatch({type: 'set user', payload: json.user});
                    localStorage.setItem('token', json.token);
                } else {
                    dispatch({type: 'isAuth false'});
                }
            })
            .catch(err => {
                console.log(err);
                localStorage.removeItem('token');
            });

    }

    useEffect(() => {
        authToken();
    }, []);

    return (
        <>
            <div className='content'>
                <header>
                    <ul className="main-menu">
                        <li className='first'><NavLink to='/' activeClassName=''>Home</NavLink></li>
                        <li><NavLink to='/products' activeClassName='active'>Products</NavLink></li>
                        <li><NavLink to='/admin' activeClassName='active'>Admin</NavLink></li>
                        {!isAuth && <li><NavLink to='/registration' activeClassName='active'>Sign up</NavLink></li>}
                        {!isAuth && <li><NavLink to='/authorization' activeClassName='active'>Sign in</NavLink></li>}
                        {isAuth && <li><NavLink to='/basket' activeClassName='active'>Basket</NavLink></li>}
                        {isAuth && <li className='logout' onClick={() => dispatch({type: 'log out'})}>log out</li>}
                        {isAuth && <li className='auth'>{currentUser.name}</li>}
                        {isAuth && <li className='basket-length'>basket <span style={{color:`red`}}>
                        {products.length}</span></li>}
                    </ul>
                    <Switch>
                        <Route exact path='/'><h1>Home</h1></Route>
                        <Route path='/products'><Main/></Route>
                        <Route path='/admin'>
                            {
                                login
                                    ? <AdminDashBoard/>
                                    : <Redirect to='/admin-login'/>
                            }
                        </Route>
                        <Route path='/basket'><Basket/></Route>
                        <Route path='/admin-login'><AdminLogin/></Route>
                        <Route path='/registration'><Registration/></Route>
                        <Route path='/authorization'><Authorization/></Route>
                    </Switch>
                </header>
            </div>
            <footer>
                <ul className="main-menu footer">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Products</Link></li>
                    {isAuth && <li><Link to="/basket">Basket</Link></li>}
                </ul>
            </footer>
        </>
    );
}

export default MainPage;
