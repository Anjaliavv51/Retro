const express = require('express');
const authRouter = express.Router();
const jwtAuth = require('../middleware/jwtAuth.js');

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  getUser,
  logout,
} = require('../controller/authController.js');

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/logout', jwtAuth, logout);
authRouter.get('/user', jwtAuth, getUser);

module.exports = authRouter;
