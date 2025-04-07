const express = require("express");
const postController = require("./post.controller");
const authWares = require("./../../middlewares/authWares");
const accountVerifyWare = require("./../../middlewares/accountVerifyWare");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");

const router = express.Router();
const upload = multerStorage(
    'public/images/post',
    /jpeg|jpg|png|webp|mp4|mkv/
);


router
    .route('/')
    .get(authWares, accountVerifyWare, postController.showPostView)
    .post(authWares, upload.single('media'), postController.createPost);






module.exports = router;