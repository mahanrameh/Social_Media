const mongoose = require("mongoose");


const schema = new mongoose.Schema({
    media: {
        path: { type: String, required: true },
        filename: { type: String, required: true },
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    hashtags: {
        type: [String]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true}
);


const model = mongoose.model('post', schema);

module.exports = model;