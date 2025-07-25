const express = require('express');
const chatRouter = express.Router();
const { getAllUsers, getmsgs, markMsg, sendmsg } = require('../controllers/chatcontroller.js');
const { protect } = require('../middleware/authmiddleware.js');

chatRouter.route('/users').get(protect, getAllUsers);
chatRouter.route('/msgs/:id').get(protect, getmsgs);
chatRouter.route('/mark/:id').put(protect, markMsg);
chatRouter.route('/send/:id').post(protect, sendmsg);

module.exports = chatRouter;