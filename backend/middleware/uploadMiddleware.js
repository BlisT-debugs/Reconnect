const multer = require('multer');
const path = require('path');

// 1. Tell Multer where to save and what to name the file
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Save to the backend/uploads folder
    },
    filename(req, file, cb) {
        // Name the file: profile-[UserID]-[Timestamp].[extension]
        cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Security: Only allow images
const checkFileType = (file, cb) => {
    const filetypes = /jpg|jpeg|png/; // Allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only! (JPG, JPEG, PNG)');
    }
};

// 3. Initialize Multer
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;