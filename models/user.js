const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    age: String,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',  // This should match the name of your post model
        },
    ],
    profilepic:{
        type: String,
        default: "defult.webp",

    }
});

module.exports = mongoose.model('user', userSchema);
