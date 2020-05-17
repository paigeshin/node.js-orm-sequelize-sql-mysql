# node.js-orm-sequelize-sql-mysql

- 기본적으로 무조건 Promise를 return한다.

# Notion Link

https://www.notion.so/Sequelize-node-ORM-056c616f9d764900b61956695c8da804

### Mapping

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d0b25ef1-1bbc-4928-8a28-3418f4ca5691/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d0b25ef1-1bbc-4928-8a28-3418f4ca5691/Untitled.png)

### What is Sequelize?

- An Object-Relational Mapping library

### Model

User  ⇒  Mapped 

- name
- email
- password
- users

### Core Concepts

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4ee88714-33f0-4dd9-b28c-a89aa24398da/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4ee88714-33f0-4dd9-b28c-a89aa24398da/Untitled.png)

- Models ⇒ User, Product
- Instances ⇒ const user = User.build()
- Queries ⇒ User.findAll()
- Associations ⇒ User.hasMany(product)

### Installation

```bash
npm install --save sequelize
```

### Define Model

util/database.js 

```jsx
const Sequelize = require('sequelize');

/* p1 - dbname, p2 - hostname, p3 - host password */
const sequelize = new Sequelize('node-complete', 'root', '123123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
```

models/product.js  - Defining Model

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;
```

models/user.js - Defining model

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;
```

models/cart.js - Defining model

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;
```

models/cartItem - Defining Model

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;
```

### Execute Query

app.js - execute squelize

```jsx
/* Create Table with Sequelize */
sequelize
    .sync()
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
```

Result

```
Executing (default): CREATE TABLE IF NOT EXISTS `products` (`id` INTEGER NOT NULL auto_increment , `title` VARCHAR(255), `price` DOUBLE PRECISION NOT NULL, `imageUrl` VARCHAR(255) NOT NULL, `description` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
Executing (default): SHOW INDEX FROM `products`
```

# ❗️Sequelize Version

### MUST READ: findById() in Sequelize 5

One quick note:

With Sequelize v5, `findById()` (which we'll use in this course) was replaced by `findByPk()`.

You use it in the same way, so you can simply replace all occurrences of `findById()` with `findByPk()`

### Essential Methods

`create()` - Sequelizer

`sync()` - Sequelizer 

`define()` - Sequelizer 

`hasMany()` - Sequelizer

`belongsTo()` - Sequelizer

`findAll()` - Model

`findByPk()` - Model

`save()` - Model 

`destroy()` - Model 

`get${Products}` - Association Method

`get${Product}` - Association Method

`create${Product}` - Association Method 

# CRUD

- Create, `/controllers/admin.js`

```jsx
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        console.log(result);
    }).catch(err => {
        console.log(error);
    });
};
```

- read, `/controllers/admin.js`

```jsx
exports.getAddProduct = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            })
        })
        .catch(err => {
          console.log(err);
        });
};
```

- read, `/controllers/shop.js`

```jsx
exports.getIndex = (req, res, next) => {
  Product
      .findAll() //parameter에 {where: } 등으로 option을 넣어서 query를 만들 수 있다.
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
```

- read, getting a single product using `findByPk`

```jsx
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
```

- read, getting a single product using, `findAll` `where`

```jsx
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findAll({where: { id: prodId }})
        .then(product => {
          res.render('shop/product-detail', {
            product: product[0],
            pageTitle: product[0].title,
            path: '/products'
          });
        })
        .catch(err => console.log(err));

};
```

- update, `controllers/admin`

```jsx
exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product
        .findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
          console.log('UPDATED PRODUCT!');
        })
        .catch(err => {
            console.log(err);
        });
    res.redirect('/admin/products');
};
```

- delete, `controllers/admin`

```jsx
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
          console.log('DESTROYED PRODUCT');
          res.redirect('/admin/products');
        })
        .catch(err => {
          console.log(err);
        });
};
```

### Associations

- 기본적으로 association을 붙이면 association들과 관련된 method들이 형성된다.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2589fb90-2e30-444c-a75c-523870c24649/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2589fb90-2e30-444c-a75c-523870c24649/Untitled.png)

Product ⇒ Cart : Belongs to Many 

User ⇒ Cart : Has One

Product ⇒ Order : Belongs to Many

User ⇒ Order : Has Many 

- Relation Types
    - Belongs to Many - Has One
    - Belongs to One - Has Many
    - Many to Many (Belongs to Many - Belongs to Many), 중간에 중재해주는 object가 필요.

- code, app.js

```jsx
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

//Define Association
//If you set constraint, and CASCADE option, it means when user is deleted, the products associated with user will be also gone.
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); //One Direction (User.haseOne(Cart), is enough but to make sure what's going on...
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});
```

- using Association Method

```jsx
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //`createProduct()`, Automatically Generated by Association You made in App.js
    req.user.createProduct(Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        console.log(result);
        res.redirect('/');
    }).catch(err => {
        console.log(error);
    }))

};
```

```jsx
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user
        .getProducts({where: {id: prodId}}) //Association Method
        .then(products => {
          const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
};
```

```jsx
exports.getProducts = (req, res, next) => {
    req.user
        .getProducts() //Association Method
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => {
            console.log(err);
        })
};
```

```jsx
exports.getCart = (req, res, next) => {
    req.user
        .getCart() //Association Method
        .then(cart => {
            return cart
                .getProducts() //Association Method, `through ``cartItem`` `
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
```

```jsx
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
            console.log("qty: " + product.cartItem.quantity);
            return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
};
```

```jsx
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
```

```jsx
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
```

- sequelizer, `force: true` option

```jsx
/* Create Table with Sequelize */
sequelize
    .sync({ force: true })
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
```

⇒ In production mode, you may never use `force: true` but in development, you can use this option to enable your node server to  `override` your database setting. 

### Manually Create user

- constraints, `CASCADE`
    - If you set constraint, and CASCADE option, it means when user is deleted, the products associated with user will be also gone

```jsx
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');

//Define Association
//If you set constraint, and CASCADE option, it means when user is deleted, the products associated with user will be also gone.
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); //One Direction (User.haseOne(Cart), is enough but to make sure what's going on...
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});

/* Create Table with Sequelize */
sequelize
// .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);

    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Paige',
                email: 'paigeshin1991@gmail.com'
            });
        }
        return Promise.resolve(user); //굳이 안해줘도 됨.
    }).then(user => {
        return user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
```

### EJS

```jsx
<%- include('../includes/head.ejs') %>
    <link rel="stylesheet" href="/css/cart.css">
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main>
            <% if (products.length > 0) { %>
                <ul class="cart__item-list">
                    <% products.forEach(p => { %>
                        <li class="cart__item">
                            <h1><%= p.title %></h1>
                                                        <!-- many to many에서 product - cart를 cartItem을 기준으로 잡아줬기 때문에, product에 cartItem에 접근이 가능하다. -->
                            <h2>Quantity: <%= p.cartItem.quantity %></h2> 
                            <form action="/cart-delete-item" method="POST">
                                <input type="hidden" value="<%= p.id %>" name="productId">
                                <button class="btn danger" type="submit">Delete</button>
                            </form>
                        </li>
                    <% }) %>
                </ul>
            <% } else { %>
                <h1>No Products in Cart!</h1>
            <% } %>
        </main>
        <%- include('../includes/end.ejs') %>
```

# Summary

### SQL

- SQL uses strict data schemas and relations
- You can connect your Node.js app via packages like mysql2
- Writing SQL Queries is not directly related to Node.js and something you have to learn in addition to Node.js

### Sequelize

- Instead of writing SQL queries manually, you can use packages (ORMs) like Sequelize to focus on the Node.js code and work with navtive JS objects
- Sequelize allows you to define models and interact with the database through them
- You can also easily set up relations ("Associations") and interact with your releated models through them

# Entire Project

### App.js

```jsx
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

/* Sequelize */
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   User.findByPk(1)
       .then(user => {
           req.user = user ;
           next();
       })
       .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Define Association
//If you set constraint, and CASCADE option, it means when user is deleted, the products associated with user will be also gone.
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); //One Direction (User.haseOne(Cart), is enough but to make sure what's going on...
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

/* Create Table with Sequelize */
sequelize
// .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);

    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Paige',
                email: 'paigeshin1991@gmail.com'
            });
        }
        return Promise.resolve(user); //굳이 안해줘도 됨.
    }).then(user => {
        return user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
```

### database

```jsx
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '123123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
```

### Router

- shop.js

```jsx
const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

module.exports = router;
```

- admin.js

```jsx
const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
```

### Model

- user.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
   id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true
   },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;
```

- product.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;
```

- cart.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;
```

- cart-item.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;
```

- order.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Order;
```

- order-item.js

```jsx
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;
```

### Controller

- admin.js

```jsx
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/edit-product', {
                prods: products,
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                editing: false
            })
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //`createProduct()`, Automatically Generated by Association You made in App.js
    req.user.createProduct(Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    }).then(result => {
        console.log(result);
        res.redirect('/');
    }).catch(err => {
        console.log(error);
    }))

};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user
        .getProducts({where: {id: prodId}}) //Association Method
        .then(products => {
          const product = products[0];
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    Product
        .findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts() //Association Method
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};
```

- error.js

```jsx
exports.get404 = (req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: '/404'});
};
```

- shop.js

```jsx
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
```
