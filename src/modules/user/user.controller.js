const userModel = require("./../../model/userModel");


exports.showEditPage = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user._id });
    return res.render('user/edit', {
        user
    });
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userID = req.user._id;

        // Handler file upload
        if (!req.file) {
            req.flash('error', 'please upload a profile picture');
            return res.redirect('/user/edit-profile');
        }

        const {filename} = req.file;
        const profilePath = `images/profile/${filename}`;

        const user = await userModel.findOneAndUpdate(
            { _id: userID },
            {profilePicture: profilePath},
            {new: true} // return updated user document
        );

        if (!user) {
            throw new Error("User not found");
        }

        req.flash('success', 'profile picture updated successfully');
        return res.redirect('/user/edit-profile');
    } catch (err) {
        next(err);
    }
};