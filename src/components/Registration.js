import React, {useState} from 'react';
import "./style/registration.scss";
import {useSelector, useDispatch} from "react-redux";
import {Redirect} from "react-router-dom";

function Registration(props) {
    const dispatch = useDispatch();
    const {name, email, password} = useSelector(state => state.user);
    const [redirect, setRedirect] = useState(false);
    const [validEmail, setValidEmail] = useState({email: '', valid: false});
    const [validName, setValidName] = useState({name: '', valid: false});
    const [validPassword, setValidPassword] = useState({password: '', valid: false});
    const host=window.location.origin;



    function onInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        (name === 'email') && setValidEmail({email: value, valid: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value)});
        (name === 'password') && setValidPassword({password: value, valid: /^(?=.*\d)(?=.*[a-z]).{7,}$/g.test(value)});
        (name === 'name') && setValidName({name: value, valid: /^[A-Za-z0-9]\w{7,}$/g.test(value)});
        dispatch({
            type: 'user sign up',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });

    }

    function registrationUser() {
        fetch(host+'/api/users', {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }).then(res => res.json())
            .then(json => {
                alert(json.message);
                setRedirect(json.redirect);
            }).catch(err => console.log(err));

    }

    return (
        <div className='registration'>
            {/*<h1>Sign up</h1>*/}
            <label htmlFor="name">Name</label>
            <span>{(validName.name && !validName.valid) && "invalid Name more than 7 char"}</span>
            <input onChange={e => onInput(e)}
                   type="text" placeholder='name' id='name' name='name'/>
            <label htmlFor="email">Email</label>
            <span>{(validEmail.email && !validEmail.valid) && "invalid Email"}</span>
            <input onChange={e => onInput(e)}
                   type="text" placeholder='email' id='email' name='email'/>
            <label htmlFor="password">Password</label>
            <span>{(validPassword.password && !validPassword.valid) && "invalid Password more than 7 chars at least one number"}</span>
            <input onChange={e => onInput(e)}
                   type="password" placeholder='password' id='password' name='password'/>
            <button onClick={registrationUser}
                    disabled={!(validName.valid && validEmail.valid && validPassword.valid)}>Sign Up
            </button>
            {redirect && <Redirect to='/authorization'/>}
        </div>
    );
}

export default Registration;