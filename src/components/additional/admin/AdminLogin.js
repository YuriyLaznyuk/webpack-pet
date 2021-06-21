import React from 'react';
import {useSelector,useDispatch} from "react-redux";
import {Redirect} from "react-router-dom";
import '../../style/adminLogin.scss'

function AdminLogin(props) {
    const {login,password,input}=useSelector(state => state.adminLogin);
    const dispatch=useDispatch();
    return (
        <div>
            <h1>Admin Log in</h1>
            <div className='admin-login'>
            <h3>password 'admin'</h3>
                <span>{(input&&input !==password)?'Invalid Password':''}</span>
            <input onChange={e=>dispatch({type:'input password', payload:e.target.value})}
                type="text" placeholder='password'/>
            <button onClick={()=>
                dispatch({type:'admin login'})}
            disabled={!(input===password)}>
                Button Admin Login</button>
            {login && <Redirect to='/admin'/>}

            </div>
        </div>
    );
}

export default AdminLogin;