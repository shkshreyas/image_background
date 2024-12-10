// /backend/server.js

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const sharp = require('sharp'); // Import sharp for image processing

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// Configure multer for file uploads
const upload = multer({
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        const acceptedTypes = /jpeg|jpg|png/;
        const extname = acceptedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = acceptedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        }
        cb('Error: File type not supported. Please upload a JPEG or PNG image.');
    }
});

// Endpoint to handle image uploads
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Log image details
    try {
        // Use sharp to get image metadata
        const image = sharp(req.file.buffer);
        const metadata = await image.metadata();

        console.log('Image Details:');
        console.log(`Title: ${req.file.originalname}`);
        console.log(`Width: ${metadata.width}`);
        console.log(`Height: ${metadata.height}`);
        console.log(`Size: ${req.file.size} bytes`);
        console.log(`MIME Type: ${metadata.format}`);

        // Set the appropriate Content-Type based on the uploaded file's mimetype
        res.type(req.file.mimetype).send(req.file.buffer);
    } catch (error) {
        console.error('Error processing the image:', error);
        res.status(500).send('Error processing the image');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});