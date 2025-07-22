const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/chatController.js')

chatRouter.post('/:person',chatController)
