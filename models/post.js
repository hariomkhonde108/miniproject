const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: { type: String, required: true }, // URL or path to the uploaded image
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, default: '' },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
