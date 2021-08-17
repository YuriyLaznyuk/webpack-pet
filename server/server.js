const express = require('express');
const app = express();
const jsonParser = express.json();
const path = require('path');
const fs = require('fs');
const rootDir = path.join(path.resolve(), 'dist');
// const rootDir = __dirname + '/../dist';
const rootFiles = path.join(path.resolve(), 'server');
const filePath = path.join(rootFiles, '/files/shop.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const upload = multer({dest: "dist/uploads"});
let PORT = process.env.PORT || 7070;
const storageConfig = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "dist/uploads");
    },
    filename: (req, file, cd) => {
        cd(null, req.body.productId + "." + file.originalname.split('.')[1]);
    }
});

app.use(express.static(rootDir + "/"));

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

app.get(/^\/(products|admin|registration|authorization|login)$/, (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

//---PRODUCT---//
// GET all products json
app.get("/api/products", (req, res) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(content).products;
    res.send(products);
});

// GET product where id
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const data = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(data);
    const products = shop.products;
    let product = null;

    products.forEach(item => {
        if (item.productId === id) {
            product = item;
        }
    });
    product ? res.send(product)
        : res.status(404).send();

});

//multer file

//POST product create
app.post("/api/products", jsonParser,
    multer({storage: storageConfig}).single("productImg"),
    (req, res) => {
        const fileData = req.file;
        let messageFile = null;

        if (!req.body) {
            return res.status(400).send('<h1>request 400</h1>');
        }

        if (!fileData) {
            messageFile = "Error loading file";

        } else {
            messageFile = "file downloaded";
            console.log(fileData);
            console.log(fileData.originalname);

        }

        const productId = req.body.productId;
        const productName = req.body.productName;
        const productDescription = req.body.productDescription;
        const productPrice = req.body.productPrice;
        const productCategory = req.body.productCategory;
        const srcImg = productId + '.' + fileData.originalname.split('.')[1];

        const product = {
            productId: productId,
            productName: productName,
            productDescription: productDescription,
            productPrice: productPrice,
            productCategory: productCategory,
            srcImg: srcImg
        };
        let data = fs.readFileSync(filePath, 'utf8');
        let shop = JSON.parse(data);
        let products = shop.products;
        products.push(product);
        data = JSON.stringify(shop);
        fs.writeFileSync(filePath, data);
        res.json({message: `add product ${messageFile}`});

    });

//PUT product update
app.put("/api/products", jsonParser, multer({storage: storageConfig}).single("productImg"),
    (req, res) => {
        const fileData = req.file;
        let messageFile = null;
        let imgProduct = null;
        if (!req.body) {
            res.status(400).json({message: 'status 400'});
        }
        if (!fileData) {
            const content = fs.readFileSync(filePath, 'utf8');
            const products = JSON.parse(content).products;
            const product = products.filter(product => product.productId === req.body.productId);
            imgProduct = product[0].srcImg;
            console.log("image file not modified");
            messageFile = "image file not modified";

        } else {
            console.log(fileData);
            console.log(fileData.originalname);
            console.log("file downloading");
            messageFile = "file downloading";

        }

        const productId = req.body.productId;
        const productName = req.body.productName;
        const productDescription = req.body.productDescription;
        const productPrice = req.body.productPrice;
        const productCategory = req.body.productCategory;
        const srcImg = (fileData) ? productId + '.' + fileData.originalname.split('.')[1]
            : imgProduct;

        let data = fs.readFileSync(filePath, 'utf8');
        let shop = JSON.parse(data);
        let products = shop.products;
        let product = null;

        products.forEach(item => {
            if (item.productId === productId) {
                product = item;
            }
        });

        if (product) {
            product.productId = productId;
            product.productName = productName;
            product.productDescription = productDescription;
            product.productPrice = productPrice;
            product.productCategory = productCategory;
            product.srcImg = srcImg;
            data = JSON.stringify(shop);
            fs.writeFileSync(filePath, data);
            return res.json({message: `edit product ${messageFile}`});
        } else {
            return res.status(404).json({message: 'status 404'});
        }
    });

//DELETE product
//delete product where id

app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const data = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(data);
    let products = shop.products;
    let product = null;
    products.forEach(item => {
        if (item.productId === id) {
            product = item;
        }
    });

    if (product) {
        const srcImg = product.srcImg;
        const index = products.indexOf(product);
        products.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(shop));
        fs.unlinkSync(`dist/uploads/${srcImg}`);
        res.send(product);
    } else {
        res.status(404).send();
    }

});

//---USERS---//

// GET all users json
app.get("/api/users", (req, res) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(content).users;
    res.send(users);
});

//POST users registration
app.post("/api/users", jsonParser, (req, res) => {
    const {password, name, email, status} = req.body;
    let content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const users = shop.users;
    const testUser = users.filter(users => users.email === email);

    if (testUser[0]) {
        return res.status(400).json({message: `User with email ${email} already exist`, redirect: false});
    }
    const hashPassword = bcrypt.hashSync(password, 8);

    const newUser = {password: hashPassword, name: name, email: email, status: status};
    users.push(newUser);
    content = JSON.stringify(shop);
    fs.writeFileSync(filePath, content);
    res.send({message: `User with email ${email} registered successfully`, redirect: true});

});
//POST USERS login
app.post('/api/users/login', jsonParser, (req, res) => {
    const {password, email} = req.body;
//search user
    const content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const users = shop.users;
    const user = users.filter(user => user.email === email);
    if (!user[0]) {
        return res.status(404).json({message: `User not found`, redirect: false});
    }
    //password verification
    const passwordValid = bcrypt.compareSync(password, user[0].password);
    if (!passwordValid) {
        return res.status(404).json({message: `Invalid password`, redirect: false});
    }
    // create token
    const token = jwt.sign({id: user[0].email}, process.env.JWT_KEY, {expiresIn: 300});
    return res.json({
        token,
        user: {
            name: user[0].name,
            email: user[0].email
        },
        message: 'user logged in',
        redirect: true
    });

});

//token middleware
app.get('/api/users/auth', (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.state(400).json({message: 'Auth error'});
        }
        //decoding token + secret key
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log(process.env.JWT_KEY);
        req.user = decoded;
        next();

    } catch (e) {
        return res.status(400).json({message: "Auth error"});
    }
}, (req, res) => {
    const email = req.user.id;
    const content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const users = shop.users;
    const user = users.filter(user => user.email === email);
    if (!user[0]) {
        return res.status(404).json({message: `User not found`});
    }
    const token = jwt.sign({id: user[0].email},
        process.env.JWT_KEY, {expiresIn: 100});

    return res.json({
        token,
        user: {
            name: user[0].name,
            email: user[0].email
        }
    });
});

//--PUT USERS status--//
app.put("/api/users", jsonParser, (req, res) => {
    const email = req.body.email;
    const status = req.body.status;
    const content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const users = shop.users;
    const user = users.filter(user => user.email === email);
    user[0].status = status;
    fs.writeFileSync(filePath, JSON.stringify(shop));
    res.send(JSON.stringify(user[0]));

});

//---BASKET---//

// GET all basket json
app.get("/api/basket", (req, res) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const basket = JSON.parse(content).basket;
    (basket.length > 0) ? res.send(basket) : res.send({message: "YUO HAVE NO ORDERS"});

});
// POST -- add order in basket

app.post("/api/basket", jsonParser, (req, res) => {
    const {idUser, idOrder, orderDate, products, status} = req.body;
    const newOrder = {
        idUser: idUser, idOrder: idOrder,
        orderDate: orderDate, products: products, status: status
    };
    let content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const basket = shop.basket;
    basket.push(newOrder);
    content = JSON.stringify(shop);
    fs.writeFileSync(filePath, content);
    res.send({message: 'order adding in basket'});

});

//--PUT ORDER status--//
app.put("/api/basket", jsonParser, (req, res) => {
    const {idUser, status} = req.body;
    const content = fs.readFileSync(filePath, 'utf8');
    const shop = JSON.parse(content);
    const basket = shop.basket;
    const order = basket.filter(order => order.idUser === idUser);
    order[0].status = status;
    fs.writeFileSync(filePath, JSON.stringify(shop));
    res.send(JSON.stringify(order[0]));

});

app.listen(PORT, () => {
    console.log(`server port ${PORT}`);
    console.log(filePath);

});


