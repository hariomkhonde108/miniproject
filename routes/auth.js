const express = require('express');
const router = express.Router();

// Sign In Route
router.get('/signin', (req, res) => {
    res.render('signin'); // Render the Sign In page
});

// Sign Up Route
router.get('/signup', (req, res) => {
    res.render('signup'); // Render the Sign Up page
});

// Handle Sign Up Form Submission
router.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Example: Save user details to the database (you need to implement this)
    console.log(`Sign Up Data: Username: ${username}, Email: ${email}`);

    res.send('Sign Up Successful!'); // Redirect or show success message
});

// Handle Sign In Form Submission
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Example: Validate user credentials (you need to implement this)
    console.log(`Sign In Data: Email: ${email}, Password: ${password}`);

    res.send('Sign In Successful!'); // Redirect or show success message
});

module.exports = router;