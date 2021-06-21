import React, {useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {
    Link,
    Route,
    useParams,
    useRouteMatch,
    Switch,
} from 'react-router-dom';
import uuid from 'uuid';
import Product from "./additional/Product";
import './style/main.scss';

function Main(props) {
    const dispatch = useDispatch();
    const { users, products, currentList, numberPage } = useSelector(state => state.shop);
    const { isAuth, currentUser } = useSelector(state => state.user);
    const basket = useSelector(state => state.basket);
    const { url, path } = useRouteMatch();
    const { idP } = useParams();

    useEffect(() => {
        fetch('http://localhost:7070/api/products')
            .then(res => res.json())
            .then(json => dispatch({type: "json products", payload: json}))
            .catch(err => console.log(err));
    }, []);

    function getListProducts(numberPage, quantity) {
        const start = numberPage * quantity - quantity;
        const end = numberPage * quantity;
        const currentListProducts = products.slice(start, end);
        dispatch({
            type: 'current list products'
            , payload: { list:currentListProducts, page:numberPage }
        });

    }

    function navPage(productsPage) {
        const quantityProducts = products.length;
        const quantityPages = Math.ceil(quantityProducts / productsPage);
        const numbersPages = [];
        for (let i = 1; i < quantityPages + 1; i++) {
            numbersPages.push(i);
        }
        return (
            numbersPages.map((page, index) => (
                <li 
                    style={{ backgroundColor:(numberPage===page) && `rgba(255, 0, 0, 0.4)` }}
                    onClick={() => getListProducts(page, 2)}
                    className='navPage-li' 
                    key={index}>{page}
                </li>
            ))
        );
    }

    function addProductBasket(idProduct, priceProduct) {
        if (!basket.idOrder && !basket.idUser && !basket.orderDate) {
            const idOrder = uuid.v4();
            const date = new Date().toLocaleString();
            const idUser = currentUser.email;
            dispatch({
                type: 'add product in basket', 
                payload: {
                    idProduct: idProduct,
                    priceProduct: priceProduct,
                    idOrder: idOrder,
                    idUser: idUser,
                    orderDate: date
                }
            });
        } else {
            dispatch({
                type: 'add product in basket next', 
                payload: {
                    idProduct: idProduct,
                    priceProduct: priceProduct
                }
            });
        }
    }

    function showProducts() {
        return (
            currentList.length > 0 
            ?
                currentList.map(item => (
                    <div className="card_product">
                        <div className={'productId'}>
                            {item.productId}
                        </div>
                        <div className='name'>
                            <button>
                                <Link to={`${url}/${item.productId}`}>
                                    {item.productName}
                                </Link>
                            </button>
                        </div>
                        <div className='price'>
                            {item.productPrice}
                        </div>
                        <div className='category'>
                            {item.productCategory}
                        </div>
                        <div className='srcImg'>
                            <img width={125} height={94} src={`http://localhost:7070/uploads/${item.srcImg}`}
                                 alt={`${item.productName}`}/>
                        </div>
                        {isAuth && <div className='addBasket'>
                            <button onClick={() => addProductBasket(item.productId, item.productPrice)}>ADD PRODUCT IN
                                BASKET
                            </button>
                        </div>}
                        {isAuth && <button className='basket'>
                            <Link to='/basket'>BASKET</Link>
                        </button>}
                    </div>
                )) 
            :
                <p>No product</p>
        );
    }

    function navProduct() {
        return (
            location.pathname.split('/').length === 4 
            ?
                <h1>BASKET Id product :{location.pathname.split('/')[3]}</h1> 
            :
                <Product idProduct={location.pathname.split('/')[2]}/>
        );
    }

    console.log(users.length + " redux");
    console.log(products.length + " redux2");
    console.log(useRouteMatch());
    console.log(useParams());
    console.log(idP);
    console.log(process.env.PORT);
    console.log(process.env.JWT_KEY);
    return (
        <div>
            <div className={"block_card"}>
                {(products.length > 0 && !currentList.length > 0) 
                ?
                    getListProducts(1, 2)
                : 
                    showProducts()}
            </div>
            <Switch>
                <Route path={`${path}/:idP`}>
                    {navProduct()}
                </Route>
            </Switch>
            <h1>{new Date().toLocaleString()}</h1>
            <ul className='navPage'>{navPage(2)}</ul>
        </div>
    );
}

export default Main;
