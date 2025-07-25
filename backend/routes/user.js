const express = require('express');
const { registeruser, authuser, checkAuth } = require('../controllers/usercontroller.js')
const userRouter = express.Router();
const { protect } = require('../middleware/authmiddleware.js');

userRouter.post('/', registeruser);
userRouter.post('/login', authuser);
userRouter.get('/check', protect, checkAuth);

module.exports = userRouter;