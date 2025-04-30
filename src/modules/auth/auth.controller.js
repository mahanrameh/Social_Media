const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
const userModel = require("./../../model/userModel");
const refreshTokenModel = require("./../../model/refreshToken");
const resetPasswordModel = require("./../../model/resetPassword");
const { response, render } = require("../../app");
const {successResponse,errorResponse} = require("./../../utils/responses");
const {registerValidationSchema,
       loginValidationSchema, 
       forgetPasswordValidationSchema,
       resetPasswordValidationSchema} = require("./auth.validator");
const { text } = require("stream/consumers");

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


        const accessToken = jwt.sign(
            {userID: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '30day'}  // because trainig purposes
        );

        console.log('refreshToken is -->',refreshTokenModel);
        
        const refreshToken = await refreshTokenModel.createToken(user);


        res.cookie('token', accessToken, {maxAge: 900000, httpOnly: true});
        res.cookie('refresh-token', refreshToken, {maxAge: 900000, httpOnly: true});

        req.flash('success', 'user created successfully');

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

exports.showLoginView = async (req, res) => {
    return res.render('auth/login');
};

exports.login = async (req, res, next) => {
try {
    const {email, password} = req.body;

    await loginValidationSchema.validate({
        email, password
    }, {
        abortEarly: false
    });

    const user = await userModel.findOne({ email }).lean();

    if (!user) {
        req.flash('error', 'user does not exist');

        return res.redirect('/auth/login');
    }

    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
        req.flash('error', 'email or password is not correct');

        return res.redirect('/auth/login');
    }

    const accessToken = jwt.sign(
        {userID: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '30day'}  // because training purposes
    );

    const refreshToken = await refreshTokenModel.createToken(user)

    res.cookie('access-token', accessToken, {maxAge: 900000, httpOnly: true});
    res.cookie('refresh-token', refreshToken, {maxAge: 900000, httpOnly: true});

    req.flash('success', 'Signed in successfully');

    return res.redirect('/auth/login');
} catch (err) {
    next(err);
}

};

exports.refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        const userID = await refreshTokenModel.verifyToken(refreshToken);
        if (!userID) {
            return res.status(404).json({
                message: 'invalid token'
            });
        }


        await refreshTokenModel.findOneAndDelete({ token: refreshToken });


        const user = await userModel.findOne({ _id: userID });
        if (user) {
            return res.status(404).json({
                message: 'user not found'
            });
        }

        const accessToken = jwt.sign(
            {userID: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '30day'}  // because trainig purposes
        );

        const newRefreshToken = await refreshTokenModel.createToken(user);

        res.cookie('token', accessToken, {maxAge: 900000, httpOnly: true});
        res.cookie('refresh-token', newRefreshToken, {maxAge: 900000, httpOnly: true});

    } catch (err) {
        next(err);
    }
};

exports.showForgetPassword = async (req, res) => {
    return res.render('auth/forgetPassword');
};

exports.showResetPassword = async (req, res) => {
    return res.render('auth/resetPassword');
};

exports.forgetPassword = async (req, res, next) => {
    try {
       const { email } = req.body;
       await forgetPasswordValidationSchema.validate(
        { email },
        {abortEarly: true}
       );
       

       const user = await userModel.findOne({ email });
       if (!user) {
        return res.status(404).json({
            message: 'user not found'
        });
       }


       const resetToken = crypto
       .randomBytes(32)
       .toString('hex');

       const resetTokenExpire = Date.now() + 1000 * 3600;

       const resetPassword = new resetPasswordModel({
        user: user._id,
        token: resetToken,
        tokenExpireTime: resetTokenExpire
       });

       
        await resetPassword.save(); 

        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mahanrameh7755@gmail.com',
                pass: process.env.GMAIL_PASS
            }
        });


        const mailOption = {
            from: 'mahanrameh7755@gmail.com',
            to: email,
            subject: 'reset password for your account',
            html:`
            <h1>hi, ${user.name}</h1>
            <a href= http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}>Reset Password</a>`
        };

        transporter.sendMail(mailOption);


        
        req.flash('success', 'email got send ');

        return res.redirect('/auth/forget-password');
        
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        await resetPasswordValidationSchema.validate(
            { token, password },
            {abortEarly: true}
        );


        const resetPassword = await resetPasswordModel.findOne({
             token, 
             tokenExpireTime: {$gt: Date.now()}
        });
        if (!resetPassword) {
            req.flash('error', 'invalid or expired token');

            return res.redirect("back");
        }
        
        const user = await userModel.findOne({ _id: resetPassword.user });
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.findOneAndUpdate(
            {_id: user._id},
            {password: hashedPassword}
        );

        await resetPasswordModel.findOneAndDelete(
            {_id: resetPassword._id}
        );
        

        req.flash('success', 'password reset successfully');

        return res.redirect('/auth/login');
    } catch (err) {
        next(err);
    }
};
