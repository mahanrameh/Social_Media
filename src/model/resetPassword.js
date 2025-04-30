const mongoose = require("mongoose");



const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    tokenExpireTime: {
        type: Number,
        required: true
    }
}, {timestamps: true}
);



const model = mongoose.model('resetPassword', schema);

module.exports = model;