// core modules
const path = require('path');
const rootdir = require('../utils/pathutil');

// external modules
const express = require('express');
const laptopRouter = express.Router();
const productController = require('../controllers/productController');
const product_details = require('../controllers/product_details')

laptopRouter.get('/',productController.productsRouter);

laptopRouter.post('/add_product',productController.postadd_product);


laptopRouter.get('/product/:product_id',product_details.product);

module.exports = laptopRouter




