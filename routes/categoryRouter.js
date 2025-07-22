const express = require('express');
const categoryRouter = express.Router();

const categoryController = require('../controllers/categoryController');

categoryRouter.get('/homecat/:item_category',categoryController.home_product_category);
categoryRouter.get('/:item_category',categoryController.product_category);

module.exports = categoryRouter;