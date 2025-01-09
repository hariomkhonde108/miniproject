const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up storage engine with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Give the file a unique name
    }
});

const upload = multer({ storage: storage });

// POST route to upload photo with description
app.post('/upload-photo', upload.single('photo'), (req, res) => {
    if (!req.file || !req.body.description) {
        return res.status(400).send({ message: 'No file or description uploaded' });
    }

    const uploadedFilePath = path.join('uploads', req.file.filename); // Path of the uploaded file
    res.status(200).send({
        message: 'Photo uploaded successfully',
        filePath: uploadedFilePath, // Return the file path to the client
        description: req.body.description // Return the description to the client
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
