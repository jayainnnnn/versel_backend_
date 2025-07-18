const express = require('express');
const adminController = require('../controllers/adminController');
adminRouter = express.Router();

adminRouter.get('/admindashboard',adminController.admin_dashboard);
adminRouter.get('/allusersdetails',adminController.admin_all_users_details);
adminRouter.get('/admin_products_view',adminController.admin_products_view);
adminRouter.put('/admin_product_update/:product_id',adminController.admin_product_update);
adminRouter.delete('/admin_product_delete/:product_id',adminController.admin_product_delete);
adminRouter.put('/admin_user_update/:email',adminController.admin_user_update);


module.exports = adminRouter;