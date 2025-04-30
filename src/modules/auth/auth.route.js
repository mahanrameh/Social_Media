const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router
    .route('/register')
    .get(authController.showRegisterView)
    .post(authController.register);


router
    .route(
        '/refresh', 
        authController.refreshToken
    );


router
    .route('/login')
    .get(authController.showLoginView)
    .post(authController.login);


router
    .route('/forget-password')
    .get(authController.showForgetPassword)
    .post(authController.forgetPassword);


router
    .route('/reset-password/:token')
    .get(authController.showResetPassword);


router
    .route('/reset-password')
    .post(authController.resetPassword);



module.exports = router;