const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router
    .route('/register')
    .get(authController.showRegisterView)
    .post(authController.register);




module.exports = router;