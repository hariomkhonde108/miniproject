const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user');  // Ensure this path is correct
const postModel = require('./models/post');  // Ensure this path is correct
const multer = require('multer');  // Added multer for file handling
const path = require('path');
const fs = require('fs');
const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';  // Use env variable for JWT secret

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'public', 'images', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Set the destination to the uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Append extension
    }
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to protect routes (JWT verification)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

app.get('/', (req, res) => {
    res.render('index');
});

// Route to render the login page
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 }); // 1 hour expiration
    res.redirect('/profile');
});

// Route to render the profile page
app.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).populate('post');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('profile.ejs', { user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

// Route to handle user logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { username, name, email, password, age } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            name,
            email,
            password: hashedPassword,
            age,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });

        res.redirect('/profile');
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Route to handle creating a new post
app.post('/post', verifyToken, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Post content cannot be empty' });
        }

        let post = await postModel.create({
            user: user._id,
            content: content,
        });

        if (user.post) {
            user.post.push(post._id);
            await user.save();
        }

        res.redirect('/profile');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
});

// Route to render the edit page for a specific post
app.get('/edit/:id', verifyToken, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.render('edit.ejs', { post });
    } catch (error) {
        console.error('Error fetching post for edit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle liking/unliking a post
app.get('/like/:id', verifyToken, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user.id;

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.redirect('/profile');
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to handle updating a post
app.post('/edit/:id', verifyToken, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.content = req.body.content;
        await post.save();

        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
});

// Route to render the profile picture update page
app.get('/upload', verifyToken, (req, res) => {
   res.render('upload.ejs')
});

app.post('/upload', verifyToken, upload.single('profile-pic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const userEmail = req.user.email;

        // Update the user's profile picture in the database
        await userModel.updateOne(
            { email: userEmail },
            { profilepic: `/images/uploads/${req.file.filename}` } // Update path to match the stored file location
        );

        res.redirect('/profile')
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('Internal server error');
    }
});

PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
