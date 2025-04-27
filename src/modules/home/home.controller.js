const {getUserInfo} = require("./../../utils/helper");


exports.showHomeView = async (req, res) => {
    const userInfo = await getUserInfo(req.user._id);
    

    return res.render('index', {
        user: userInfo
    });
};