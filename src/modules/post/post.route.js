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


router
    .route('/like')
    .post(authWares, postController.like);


router
    .route('/dislike')
    .post(authWares, postController.disLike);


router
    .route('/save')
    .post(authWares, postController.save);


router
    .route('/unsave')
    .post(authWares, postController.unSave);


router
    .route('/allsave')
    .get(authWares, postController.showSaveView);






module.exports = router;