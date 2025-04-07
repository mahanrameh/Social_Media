


module.exports = async (req, res, next) => {
    try {
        const isVerified = req.user.isVerified;
        console.log('logiiiiiiing',isVerified);
        
        if (!isVerified) {
            req.flash('verifyMessage', 'you need to verify your account');

            return res.render('post/upload');
        }

        next();
    } catch (err) {
        next(err);
    }
};