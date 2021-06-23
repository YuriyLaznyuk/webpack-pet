import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ModalDashboard from "./ModalDashboard";

function Products(props) {

    const dispatch = useDispatch();
    const {products} = useSelector(state => state.shop);
    const {addProduct,addFlag,editFlag} = useSelector(state => state.dashboard);
    const host=window.location.origin;

    function reqServer() {
        fetch(host+'/api/products')
            .then(res => res.json())
            .then(json => {
                dispatch({type: "json products", payload: json});
                console.log('regServer');
            })
            .catch(err => console.log(err));
    }


    useEffect(() => {
        reqServer();
    }, [addFlag,editFlag]);

    function editProduct(id) {
        dispatch({type: 'edit product', payload: id});
    }

    function deleteProduct(id) {

        fetch(host+'/api/products/' + id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json; charset=utf-8"}
        }).then(res => {
            if (res.ok) {

                console.log(`delete product ${id}`);
            }
        }).catch(err => console.log(err));

        reqServer();

    }

    function showTable() {

        return (
            products.length > 0 ?
                products.map(item => (
                    <tr className='tr-map' key={item.productId}>
                        <td>{item.productId}</td>
                        <td>{item.productName}</td>
                        <td>{item.productDescription}</td>
                        <td>{item.productPrice}</td>
                        <td>{item.productCategory}</td>
                        <td>
                            <button onClick={() => editProduct(item.productId)}
                                    className='buttons-control'>edit
                            </button>
                            <button onClick={() => deleteProduct(item.productId)}
                                    className='buttons-control'>delete
                            </button>
                        </td>
                    </tr>

                )) : <tr>
                    <th colSpan={6}>No Products</th>
                </tr>

        );

    }

    return (
        <div className='admin-dashboard'>
            {addProduct && <ModalDashboard/>}
            <table className='table-dashboard'>
                <thead>
                <tr className='head'>
                    <th colSpan={6}>
                        <span>Table products</span>
                        <button onClick={() => dispatch({type: 'add product'})}
                                className='head-button'>add product
                        </button>
                    </th>
                </tr>
                <tr className='head-column'>
                    <th>productId</th>
                    <th>productName</th>
                    <th>productDescription</th>
                    <th>productPrice</th>
                    <th>productCategory</th>
                    <th>buttons control</th>
                </tr>
                </thead>
                <tbody>
                {showTable()}
                </tbody>
            </table>


        </div>

    );
}

export default Products;