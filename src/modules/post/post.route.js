const express = require("express");
const postController = require("./post.controller");
const authWares = require("./../../middlewares/authWares");
const accountVerifyWare = require("./../../middlewares/accountVerifyWare");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");

const router = express.Router();
const upload = multerStorage(
    'public/images/post',
    /image\/jpeg|image\/jpg|image\/png|image\/webp|video\/mp4|video\/mkv/
);


router
    .route('/')
    .get(authWares, accountVerifyWare, postController.showPostView)
    .post(authWares, upload.single('media'), postController.createPost);






module.exports = router;