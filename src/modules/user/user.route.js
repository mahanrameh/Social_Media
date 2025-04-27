const express = require("express");
const userController = require("./user.controller");
const authWares = require("./../../middlewares/authWares");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");

const router = express.Router();
const upload = multerStorage('public/images/profile');


router
    .route('/edit-profile')
    .get(authWares, userController.showEditPage);


router
    .route('/profile/picture')
    .post(authWares,
         upload.single('profile'),
         userController.updateProfile);



module.exports = router;