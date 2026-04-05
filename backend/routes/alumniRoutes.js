const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile, getAllAlumni } = require('../controllers/alumniController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Both routes require the user to be logged in
router.get('/profile', protect, getProfile);
router.post('/profile', protect, upsertProfile);
router.post('/upload', protect, upload.single('profile_pic'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }    
    res.json({
        message: 'Image uploaded successfully',
        filePath: `/${req.file.path.replace(/\\/g, '/')}` // Normalizes Windows slashes to Web slashes
    });
});
router.get('/directory', protect, getAllAlumni);

module.exports = router;