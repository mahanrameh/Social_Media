const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { date } = require("yup");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expire: {
        type: Date,
        required: true
    }
}, {timestamps: true}
);

schema.static.createToken = async (user) => {
    const expiresIn = +process.env.REFRESH_TOKEN_EXPIRE;
    const refreshToken = uuidv4();
    const refreshTokenDocument = new model({
        token: refreshToken,
        user: user._id,
        expire: new Date(Date.now() + (expiresIn * 24 * 60 * 60 * 1000))
    });

    await refreshTokenDocument.save();

    return refreshToken;
};

schema.static.verifyToken = async (token) => {
    const refreshTokenDocument = await model.findOne({ token });

    if (
        refreshTokenDocument &&
        refreshTokenDocument.expire >= Date.now()
    ) {
        return refreshTokenDocument.user;
    } else {
        return null;
    }
};


const model =  mongoose.model('Refresh_Token',schema);

module.exports = model;