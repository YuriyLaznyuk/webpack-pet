import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import "./style/basket.scss";

function Basket(props) {
    const basket = useSelector(state => state.basket);
    const {currentUser} = useSelector(state => state.user);
    const {orders} = useSelector(state => state.orders);
    const dispatch = useDispatch();
    const host = window.location.origin;

    function currentOrder() {
        return (
            basket.products.map((item, index) => (
                <tr key={item.idProduct}>
                    <td>{item.idProduct}</td>
                    <td>{item.countProduct}</td>
                    <td>{item.priceProduct}</td>
                    <td>
                        <input
                            onChange={(e) => dispatch({
                                type: 'add count',
                                payload: {index: index, count: e.target.value}
                            })}
                            value={item.countProduct}
                            type="number"
                            min={1}
                            max={10}
                            style={{width: '40px'}}
                            title={'add quantity'}
                        />
                        <input
                            onClick={() => dispatch({
                                type: 'delete product',
                                payload: {index: index}
                            })}
                            type="button"
                            value="DELETE"
                        />
                    </td>
                </tr>
            ))
        );
    }

    function confirmOrder() {
        fetch(host + '/api/basket', {
            method: 'POST',
            headers: {"Content-Type": "application/json; charset=utf-8"},
            body: JSON.stringify({
                idUser: basket.idUser,
                idOrder: basket.idOrder,
                orderDate: basket.orderDate,
                products: basket.products,
                status: 'confirmed'
            })
        })
            .then(res => res.json())
            .then(json => {
                alert(json.message);
                dispatch({type: 'clear basket redux'});
            })
            .catch(err => console.log(err));
    }

    function getConfirmedOrders() {
        fetch(host + '/api/basket')
            .then(res => res.json())
            .then(json => {
                (json.message)
                    ? alert(json.message)
                    : dispatch({type: 'get orders', payload: json});
            })
            .catch(err => console.log(err));
    }

    function showOrders() {
        const ordersFilter = orders.filter(item => (item.idUser === currentUser.email));
        if (!ordersFilter && !ordersFilter.length > 0) {
            return;
        }
        return (
            ordersFilter.map((item, index) => (
                <table className='basket-table'>
                    <thead>
                    <tr>
                        <th colSpan={3}>order status {item.status}</th>
                    </tr>
                    <tr key={item.orderDate}>
                        <th>{item.idUser}</th>
                        <th>{item.idOrder}</th>
                        <th>{item.orderDate}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        item.products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.idProduct}</td>
                                <td>{product.countProduct}</td>
                                <td>{product.priceProduct}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            ))
        );
    }

    return (
        <div>
            <h1>Basket shop product</h1>
            {basket.idOrder && <table className='basket-table'>
                <thead>
                <tr>
                    <th colSpan={4}>
                        <span className='th-span'>{`user name: ${currentUser.name}`}</span>
                        <span className='th-span'>{`user email: ${currentUser.email}`}</span>
                        <span className='th-span'>{`order id: ${basket.idOrder}`}</span>
                    </th>
                </tr>
                <tr>
                    <th colSpan={4}>ORDERS LISTS
                        <button onClick={confirmOrder} className='basket-confirm'>
                            confirm order
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>id product</td>
                    <td>count product</td>
                    <td>price product</td>
                    <td>buttons</td>
                </tr>
                {currentOrder()}
                </tbody>
            </table>}
            <button
                className='get-orders'
                onClick={getConfirmedOrders}
            >
                MY CONFIRMED ORDERS
            </button>
            {showOrders()}
        </div>
    );
}

export default Basket;
