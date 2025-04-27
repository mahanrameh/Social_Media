const express = require("express");
const homeController = require("./home.controller");
const authWares = require("../../middlewares/authWares");

const router = express.Router();


router.get('/', authWares, homeController.showHomeView);





module.exports = router;