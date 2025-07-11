const express = require('express');
const adminController = require('../controllers/adminController');
adminRouter = express.Router();

adminRouter.get('/usersdetails',adminController.usersdetails);
adminRouter.get('/productdetails',adminController.productdetails);

module.exports = adminRouter;