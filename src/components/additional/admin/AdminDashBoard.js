import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import '../../style/adminDashBoard.scss';
import Products from "./Products";
import Orders from "./Orders";
import Users from "./Users";

function AdminDashBoard(props) {
    const dispatch = useDispatch();
    const {choice} = useSelector(state => state.dashboard);




    return (
    <>
            <h1 style={{margin:'10px 0 10px 0'}}>Admin Dashboard</h1>
        <ul className='nav-dashboard'>
            <li onClick={()=>dispatch({type:"nav choice",payload:"products"})}
            style={{backgroundColor:(choice==='products')&&'#ed143d42'}}>PRODUCTS</li>
            <li onClick={()=>dispatch({type:"nav choice",payload:"users"})}
            style={{backgroundColor:(choice==='users')&&'#ed143d42'}}>USERS</li>
            <li onClick={()=>dispatch({type:"nav choice",payload:"orders"})}
            style={{backgroundColor:(choice==='orders')&&'#ed143d42'}}>ORDERS</li>
        </ul>

        {choice==='products'&& <Products/>}
        {choice==='users'&& <Users/>}
        {choice==='orders'&& <Orders/>}

        </>
    );
}

export default AdminDashBoard;