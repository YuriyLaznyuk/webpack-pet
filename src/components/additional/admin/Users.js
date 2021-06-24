import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";

function Users(props) {
    const dispatch = useDispatch();
    const {users} = useSelector(state => state.shop);
    const host = window.location.origin;

    function reqServerUsers() {
        fetch(host + "/api/users")
            .then(res => res.json())
            .then(json => dispatch({type: "json users", payload: json}))
            .catch(err => console.log(err));

    }

    useEffect(() => {
        reqServerUsers();
    }, [users]);

    function showUsers() {
return(
    users.length>0 ?
    users.map(user=>(
        <tr className='tr-map' key={user.password}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td>{user.status}</td>
            <td>
                <span style={{fontWeight:'700'}}>select status</span>
                <select className='buttons-control'
                    name="" id="">
                    <option value='regular'>regular</option>
                    <option value='admin'>admin</option>
                    <option value='no active'>no active</option>
                </select>
                <button className='buttons-control'>send</button>
            </td>
        </tr>
    ))
        :<tr>
        <td colSpan={5}>No users</td>
        </tr>
)
    }

    return (
        <div className='admin-dashboard'>
            <table className='table-dashboard'>
                <thead>
                <tr className='head'>
                    <td colSpan={5}>Table users</td>
                </tr>
                <tr className='head-column'>
                    <td>name</td>
                    <td>email</td>
                    <td>password</td>
                    <td>status</td>
                    <td>buttons control</td>
                </tr>
                </thead>
                <tbody>
                {showUsers()}
                </tbody>

            </table>
        </div>
    );
}

export default Users;