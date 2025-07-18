const express = require('express');
const adminController = require('../controllers/adminController');
adminRouter = express.Router();

adminRouter.get('/admindashboard',adminController.admindashboard);
adminRouter.get('/allusersdetails',adminController.allusersdetails);
adminRouter.get('/admin_products_view',adminController.admin_products_view);
adminRouter.put('/admin_product_update/:product_id',adminController.admin_product_update);
adminRouter.delete('/admin_product_delete/:product_id',adminController.admin_product_delete);


module.exports = adminRouter;