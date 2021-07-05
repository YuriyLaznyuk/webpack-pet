import React from 'react';
import {useSelector} from "react-redux";

function Product(props) {
    const {products} = useSelector(state => state.shop);
    const id = props.idProduct;
    const product = products.filter(item => item.productId === id);
    console.log(id);
    console.log(product);
    return (
        <div>
            <h1>Product test page</h1>
            <h1>{product[0].productDescription}</h1>
        </div>
    );
}

export default Product;
