// external modules
const express = require('express');
const productRouter = express.Router();
const productController = require('../controllers/productController');
const product_details = require('../controllers/product_details');

productRouter.get('/',productController.productsRouter);
productRouter.get('/search/:productName',productController.search);
productRouter.post('/add_product',productController.postadd_product);


productRouter.get('/product/:product_id',product_details.product);

module.exports = productRouter;




