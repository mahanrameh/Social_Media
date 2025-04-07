const bcrypt = require("bcryptjs");
const { response, render } = require("../../app");
const userModel = require("./../../model/userModel");
const refreshTokenModel = require("./../../model/refreshToken");
const jwt = require("jsonwebtoken");
const {successResponse,errorResponse} = require("./../../utils/responses");
const {registerValidationSchema, loginValidationSchema} = require("./auth.validator");

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

