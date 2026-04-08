const express = require('express');
const router = express.Router();
const { getProfile, upsertProfile, getAllAlumni } = require('../controllers/alumniController'); // <-- Brought getAllAlumni back
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/profile', protect, getProfile);
router.post('/profile', protect, upsertProfile);
router.get('/directory', protect, getAllAlumni); // <-- Restored the Directory route!

router.post('/upload', protect, upload.single('profile_pic'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }    
    res.json({
        message: 'Image uploaded successfully',
        filePath: `/${req.file.path.replace(/\\/g, '/')}`
    });
});

module.exports = router;