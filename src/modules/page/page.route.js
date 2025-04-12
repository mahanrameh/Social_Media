const express = require("express");
const pageController = require("./page.controller");

const router = express.Router();


router
    .route('/:pageID')
    .get(pageController.getPage);




module.exports = router;