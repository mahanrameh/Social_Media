const mongoose = require("mongoose");
const { string } = require("yup");


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
    content: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'comment'
    }
}, {timestamps: true}
);


const model = mongoose.model('comment', schema);

module.exports = model;