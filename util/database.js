const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '123123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
