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


