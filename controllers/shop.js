const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
    Product
        .findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart() //Association Method
        .then(cart => {
            return cart
                .getProducts() //Association Method
                .then(cartProducts => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: cartProducts //through를 통해서 연결된 cartItem
                    })
                })
                .catch();
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;

    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => { //cart를 집어온다.
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}}); //Association Method
        })
        .then(products => { //product를 집어온다.
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) { //이미 product가 cart에 존재한다면...
                const oldQuantity = product.cartItem.quantity; //extra field created by sequelizer
                newQuantity = oldQuantity + 1;
                return product;
            }

            //Add Product to cart
            return Product.findByPk(prodId) //product id를 기준으로 product를 잡아온다.
        })
        .then(product => {
            // console.log("qty: " + product.cartItem.quantity);
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            const product = products[0];
            product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {

    let fetchedCart;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']}) //orders를 가져올 때 products도 가져와라..
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders //orders에 product값이 붙여져서 나간다.
            });
        })
        .catch(err => console.log(err));

};

