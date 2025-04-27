const mongoose = require("mongoose");



const schema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'post',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true}
);


const model = mongoose.model('save', schema);

module.exports = model;