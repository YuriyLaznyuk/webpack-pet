import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import "../../style/basket.scss";

function Orders(props) {
    const host = window.location.origin;
    const dispatch = useDispatch();
    const {orders} = useSelector(state => state.orders);
    const [options, setOptions] = useState({status: '', email: ''});
    const [render, setRender] = useState(false);

    function getConfirmOrders() {
        fetch(host + "/api/basket")
            .then((res => res.json()))
            .then(json => {
                json.message ? alert(json.message)
                    : dispatch({type: 'get orders', payload: json});
            }).catch(err => console.log(err));
    }

    useEffect(() => {
        getConfirmOrders();
    }, [render]);

    function editStatus() {
        fetch(host + '/api/basket', {
            method: 'PUT',
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({
                idUser: options.email,
                status: String(options.status)
            })
        }).then(res => res.json())
            .then(json => {
                console.log(json);
                setRender(!render);
            }).catch(err => console.log(err));
    }

    function showConfirm() {
        return (
            orders.map(order => (
                orders.length > 0 ?
                    <table className='basket-table'>
                        <thead>
                        <tr>
                            <th colSpan={3} style={{backgroundColor:`#e6e0e0`}}>order status: {order.status}
                                <select className='buttons-control' name="status"
                                        onChange={e => setOptions({
                                            status: e.target.value,
                                            email: order.idUser
                                        })}>
                                    <option value="">select status</option>
                                    <option value="pending">pending</option>
                                    <option value="deleted">deleted</option>
                                    <option value="confirmed">confirmed</option>
                                    <option value="paid">paid</option>
                                </select>
                                <button disabled={order.idUser !== options.email}
                                        className='buttons-control' onClick={editStatus}>submit
                                </button>

                            </th>
                        </tr>
                        <tr key={order.orderDate}>
                            <th>email: {order.idUser}</th>
                            <th>id: {order.idOrder}</th>
                            <th>date: {order.orderDate}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.products.map((product, index) => (
                            <tr key={index}>
                                <td>idProduct: {product.idProduct}</td>
                                <td>quantity: {product.countProduct}</td>
                                <td>price: {product.priceProduct}</td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                    : <h2>No orders</h2>
            ))
        );

    }

    return (
        <div className='admin-dashboard'>
            <h1>Orders</h1>

            {showConfirm()}

        </div>
    );
}

export default Orders;