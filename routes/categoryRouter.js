const express = require('express')
const categoryRouter = express.Router()
const {requireLogin} = require('../models/auth')

const categoryController = require('../controllers/categoryController')

categoryRouter.get('/:item_category',requireLogin,categoryController.product_category)
module.exports = categoryRouter;