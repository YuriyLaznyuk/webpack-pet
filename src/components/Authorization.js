import React,{ useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom"
import './style/authorization.scss';

function Authorization(props) {
    const dispatch = useDispatch();
    const { emailLogin, passwordLogin, isAuth } = useSelector(state => state.user);
    const [ redirect, setRedirect ] = useState();
    const [validEmail, setValidEmail] = useState({email: '', valid: false});
    const [validPassword, setValidPassword] = useState({password: '', valid: false});
    const host=window.location.origin;


    function onInput(e) {

        const name = e.target.name;
        const value = e.target.value;
        (name === 'emailLogin') && setValidEmail({email: value, valid: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)});
        (name === 'passwordLogin') && setValidPassword({password: value, valid: /^(?=.*\d)(?=.*[a-z]).{7,}$/g.test(value)});
        dispatch({
            type: 'user log in',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }
    
    function authorizationUser() {
        fetch(host+'/api/users/login',{
            method:"POST",
            headers:{
                "Content-Type": "application/json; charset=utf-8"
            },
            body:JSON.stringify({
                email:emailLogin,
                password:passwordLogin
            })
        })
            .then(res => res.json())
            .then(json => {
                alert(json.message);
                setRedirect(json.redirect);
                if (json.redirect) {
                    dispatch({
                        type: 'set user',
                        payload: json.user
                    });
                    localStorage.setItem('token',json.token);
                }
               console.log(json)
            })
            .catch(err => console.log(err))
    }
    
    return (
        <div className='authorization'>
            {/*<h1>Log in</h1>*/}
            <label htmlFor="email">Email</label>
            <span>{(validEmail.email && !validEmail.valid) && "invalid Email"}</span>
            <input 
                onChange={e => onInput(e)}
                type="text"
                placeholder='email'
                id='email'
                name='emailLogin'
            />
            <label htmlFor="password">Password</label>
            <span>{(validPassword.password && !validPassword.valid) && "invalid Password more than 7 chars at least one number"}</span>
            <input
                onChange={e => onInput(e)}
                type="password"
                placeholder='password'
                id='password'
                name='passwordLogin'
            />
            <button onClick={authorizationUser}
                    disabled={!(validEmail.valid && validPassword.valid)}>
                Sign In
            </button>
            {redirect && <Redirect to='/'/> }
        </div>
    );
}

export default Authorization;
