import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";

function Users(props) {
    const dispatch = useDispatch();
    const {users} = useSelector(state => state.shop);
    const host = window.location.origin;
    const [options, setOptions] = useState({status: '', email: ''});
    const [render, setRender] = useState(false);

    function reqServerUsers() {
        fetch(host + "/api/users")
            .then(res => res.json())
            .then(json => dispatch({type: "json users", payload: json}))
            .catch(err => console.log(err));

    }

    useEffect(() => {
        reqServerUsers();
    }, [render]);

    function editStatus() {
        if (!String(options.status).length > 0) {
            return;
        }

        fetch(host + "/api/users", {

            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            method: "PUT",
            body: JSON.stringify({

                status: String(options.status),
                email: options.email
            })
        }).then(res => res.json())
            .then(json => {
                console.log(json);
                setRender(!render);
            })
            .catch(err => alert(err));
    }

    console.log(options.status);

    function showUsers() {
        return (
            users.length > 0 ?
                users.map(user => (
                    <tr className='tr-map' key={user.password}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.password}</td>
                        <td>{user.status}</td>
                        <td>
                            <select onChange={e => setOptions({status: e.target.value, email: user.email})}
                                    className='buttons-control'
                                    name='status' id="">
                                <option value=''>select status</option>
                                <option value='regular'>regular</option>
                                <option value='admin'>admin</option>
                                <option value='no active'>no active</option>
                            </select>
                            <button disabled={user.email !== options.email}
                                    className='buttons-control' onClick={editStatus}>submit
                            </button>

                        </td>
                    </tr>
                ))
                : <tr>
                    <td colSpan={5}>No users</td>
                </tr>
        );
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