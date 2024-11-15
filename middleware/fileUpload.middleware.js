const multer = require('multer');
const { extname } = require('path');



// Configure multer storage
const storage = multer.memoryStorage(); 

const postUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        if (file.fieldname === 'post') {
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.webp') {
                return cb(new Error('Post must be a valid image format'));
            }
        }
        cb(null, true);
    }
})

module.exports = { postUpload };

