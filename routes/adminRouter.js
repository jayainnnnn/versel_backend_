const express = require('express');
const adminController = require('../controllers/adminController');
adminRouter = express.Router();

adminRouter.get('/admindashboard',adminController.admindashboard);
adminRouter.get('/allusersdetails',adminController.allusersdetails)


module.exports = adminRouter;