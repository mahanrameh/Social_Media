const userModel = require("./../model/userModel");


const getUserInfo = async (userID) => {
    const user = await userModel.findOne({
        _id: userID
    });

    return user;
};


module.exports = {getUserInfo};