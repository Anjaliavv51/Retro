const express = require("express");
const authRouter = express.Router();
const jwtAuth = require("../middleware/jwtAuth.js");

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  getUser,
  logout
} = require("../controller/authController.js");

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);


authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

module.exports = authRouter;
