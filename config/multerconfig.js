const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Define the uploads directory
const uploadsDir = path.join(__dirname, 'public', 'images', 'uploads'); // Correct spelling

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); // Set the destination to the uploads directory
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, name) => {
            if (err) return cb(err); // Handle the error appropriately

            const fn = name.toString("hex") + path.extname(file.originalname);
            cb(null, fn); // Move the callback here, after fn is defined
        });
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
