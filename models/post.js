const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  // This should match the name of your user model
    },
    date: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    likes: [{  // Change from `like` to `likes`
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        default:[] // This should match the name of your user model
    }],
});

// Export the Post model
module.exports = mongoose.model('post', postSchema);  // Make sure this matches the ref in your user model
