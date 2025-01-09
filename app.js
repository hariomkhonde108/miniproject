const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Post = require('./models/post');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Import Routes
const authRoutes = require('./routes/auth');

// Use Routes
app.use('/auth', authRoutes);

// // Default Route
// app.get('/', (req, res) => {
//     res.render('index.ejs'); // Optional landing page
// });
// app.get('/signin', (req,res)=>{
//     res.render('signin.ejs')
// })
app.get('/', (req, res) => {
    res.render('index'); // Render home or landing page
});

app.get('/signin', (req, res) => {
    res.render('signin'); // Render signin page
});

app.get('/signup', (req, res) => {
    res.render('signup'); // Render signup page (if you plan to add a sign up page)
});


// Server Start
const PORT = 8080;
app.listen(PORT, () => {
   console.log("sever running")
});     