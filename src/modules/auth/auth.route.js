const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router
    .route('/register')
    .get(authController.showRegisterView)
    .post(authController.register);

router
    .route('/login')
    .get(authController.showLoginView)
    .post(authController.login);




module.exports = router;