import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import '../../style/modalDashboard.scss';

function ModalDashboard(props) {
    const dispatch = useDispatch();
    const {
        productId, productName, productDescription,
        productPrice, productCategory, productImg,
        editProduct, editIndex
    } = useSelector(state => state.dashboard);
    const {products} = useSelector(state => state.shop);
    const host=window.location.origin;


    let _editProduct = [];
    if (editIndex) {
        _editProduct = products.filter(item => item.productId === editIndex);
    }

    function inputProduct(e) {
        dispatch({
            type: 'input product',
            payload: {
                name: e.target.name,
                value: e.target.value,
            }
        });
    }

    function inputFile(e) {
        dispatch({
            type: 'input file',
            payload: {
                file: e.target.files[0]
            }
        });
    }

    function fetchServer() {
        fetch(host+'/api/products')
            .then(res => res.json())
            .then(json => dispatch({type: "json products", payload: json}))
            .catch(err => console.log(err));
    }

    function addServer() {

        if (editProduct) {
            const formData = new FormData();
            formData.append("productId", _editProduct[0].productId);
            formData.append("productName", productName ? productName : _editProduct[0].productName);
            formData.append("productDescription", productDescription ? productDescription : _editProduct[0].productDescription);
            formData.append("productPrice", productPrice ? productPrice : _editProduct[0].productPrice);
            formData.append("productCategory", productCategory ? productCategory : _editProduct[0].productCategory);
            formData.append("productImg", productImg);

            fetch(host+'/api/products', {
                method: "PUT",
                headers: {
                    // "Content-Type": "application/json; charset=utf-8"
                    // 'Accept': 'multipart/form-data'
                },

                body: formData

            }).then(res => res.json())
                .then(json => {
                    console.log(json.message);
                    alert(json.message);

                    dispatch({type: 'cancel product'});
                    dispatch({type: 'edit flag'});
                }).catch(err => console.log(err));

        } else {
            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("productName", productName);
            formData.append("productDescription", productDescription);
            formData.append("productPrice", productPrice);
            formData.append("productCategory", productCategory);
            formData.append("productImg", productImg);
            fetch(host+'/api/products', {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json; charset=utf-8"
                },
                body: formData


            }).then(res => res.json())
                .then(json => {
                    alert(json.message);
                    console.log(json);
                    dispatch({type: 'cancel product'});
                    dispatch({type: 'add flag'});
                }).catch(err => console.log(err));

        }

    }

    return (
        <div className='modal-dashboard'>
            {editProduct ? <h1>edit product</h1> : <h1>add product</h1>}
            <div className='modal-dashboard_input'>
                <label htmlFor="productId">productId</label>
                <input onChange={e => inputProduct(e)} disabled={editProduct}
                       defaultValue={_editProduct[0] ? _editProduct[0]['productId'] : ''}
                       type="text" placeholder="productId" name='productId' id='productId'/>
                <label htmlFor="productName">productName</label>
                <input onChange={e => inputProduct(e)}
                       defaultValue={_editProduct[0] ? _editProduct[0]['productName'] : ''}
                       type="text" placeholder="productName" name='productName' id='productName'/>
                <label htmlFor="productDescription">productDescription</label>
                <input onChange={e => inputProduct(e)}
                       defaultValue={_editProduct[0] ? _editProduct[0]['productDescription'] : ''}
                       type="text" placeholder="productDescription" name='productDescription' id='productDescription'/>
                <label htmlFor="productPrice">productPrice</label>
                <input onChange={e => inputProduct(e)}
                       defaultValue={_editProduct[0] ? _editProduct[0]['productPrice'] : ''}
                       type="text" placeholder="productPrice" name='productPrice' id='productPrice'/>
                <label htmlFor="productCategory">productCategory</label>
                <input onChange={e => inputProduct(e)}
                       defaultValue={_editProduct[0] ? _editProduct[0]['productCategory'] : ''}
                       type="text" placeholder="productCategory" name='productCategory' id='productCategory'/>
                <label htmlFor="productImg">productImg</label>
                <input onChange={e => inputFile(e)} multiple={false}
                       type="file" name='productImg' id='productImg'/>


                <div className='dashboard_input-btn'>
                    <button onClick={() => dispatch({type: 'cancel product'})}>
                        cancel
                    </button>
                    <button onClick={addServer}>
                        save
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModalDashboard;