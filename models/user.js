const mongoose = require('mongoose');

// MongoDB Atlas connection string
const uri = 'mongodb+srv://eagonofficial:fa1P9n0Rd76rS0EI@cluster0.t9h2d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB Atlas:', err);
    });

module.exports = mongoose;

