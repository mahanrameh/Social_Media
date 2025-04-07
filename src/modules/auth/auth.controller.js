const { compareSync } = require("bcryptjs");
const { response, render } = require("../../app");
const userModel = require("./../../model/userModel");
const jwt = require("jsonwebtoken");
const {successResponse,errorResponse} = require("./../../utils/responses");
const {registerValidationSchema} = require("./auth.validator");

exports.register = async (req, res, next) => {
    try {
        const {email, username, name, password} = req.body;

        await registerValidationSchema.validate({
            email, username, name, password
        }, {
            abortEarly: false
        });


        const userExist = await userModel.findOne({
            $or: [{username}, {email}]
        });
    
        if (userExist) {
            req.flash('error', 'email or username already exist');

            return res.redirect('/auth/register');
        }
   
        const isFirstUser = (await userModel.countDocuments()) == 0;
        let role = 'USER';
        
        if (!isFirstUser) {
            role = 'ADMIN';
        }
    
        let user = new userModel({ email, username, name, password });
        user = await user.save();

        req.flash('success', 'user created successfully');

        const accessToken = jwt.sign(
            {userID: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '30day'}  // because trainig purposes
        );

        

        res.cookie('token', accessToken, {maxAge: 900000, httpOnly: true});

        return res.redirect('/auth/register');
    
        // return successResponse(res, 201, {
        //     message: 'user created successfully',
        //     user: {...(user.toObject()), password: undefined}
        // });

    } catch (err) {
        next(err);
}
};

exports.showRegisterView = async (req, res) => {
    return res.render('auth/register');
};