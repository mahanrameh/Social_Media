const express = require("express");
const pageController = require("./page.controller");
const authWares = require("./../../middlewares/authWares");

const router = express.Router();


router
    .route('/:pageID')
    .get(authWares, pageController.getPage);
    

router
    .route('/:pageID/follow')
    .post(authWares, pageController.follow);


router
    .route('/:pageID/unfollow')
    .post(authWares, pageController.unFollow);




module.exports = router;