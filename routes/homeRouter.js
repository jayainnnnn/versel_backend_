// external module
const express = require('express');
const homeRouter = express.Router();

const homeController = require("../controllers/homeController");

homeRouter.post("/login",homeController.postlogin);
homeRouter.post("/signup",homeController.postsignup);
homeRouter.get("/logout",homeController.getlogout);



module.exports = homeRouter;




