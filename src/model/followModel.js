const mongoose = require("mongoose");



const schema = new mongoose.Schema({
    follower: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    following: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true}
);


const model = mongoose.model('follow', schema);

module.exports = model;