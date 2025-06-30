// external module
const express = require('express')
const homeRouter = express.Router()

const homeController = require("../controllers/homeController");

homeRouter.get("/",homeController.homeController)

homeRouter.get("/login",homeController.getlogin)
homeRouter.post("/login",homeController.postlogin);

homeRouter.get("/signup",homeController.getsignup);
homeRouter.post("/signup",homeController.postsignup);

homeRouter.get("/logout",homeController.getlogout);

homeRouter.get("/404",homeController.get404);
module.exports = homeRouter;




