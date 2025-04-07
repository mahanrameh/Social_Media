const jwt = require("jsonwebtoken");
const userModel = require("./../model/userModel");


module.exports = async (req, res, next) => {
    try {
        const token = req.cookies['access-token'];
        if (!token) {
            req.flash('error', 'please login first');
            res.redirect('/auth/login');
        }

        const payLoad = jwt.verify(token, process.env.JWT_SECRET)
        if (!payLoad) {
            req.flash('error', 'please login first');
            res.redirect('/auth/login');
        }

        const userID = payLoad.userID;
        const user = await userModel.findOne({ _id: userID }).lean();

        
        if (!user) {
            req.flash('error', 'please login first');
            res.redirect('/auth/login');
        }

        req.user = user;

        next();
        
    } catch (err) {
        next(err);
    }
};