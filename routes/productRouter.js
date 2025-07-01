// core modules
const path = require('path');
const rootdir = require('../utils/pathutil');
const {requireLogin} = require('../models/auth')
// external modules
const express = require('express');
const laptopRouter = express.Router();
const productController = require('../controllers/productController');
const product_details = require('../controllers/product_details')

laptopRouter.get('/',requireLogin,productController.productsRouter);

laptopRouter.post('/add_product',requireLogin,productController.postadd_product);


laptopRouter.get('/product/:product_id',requireLogin,product_details.product);

module.exports = laptopRouter




