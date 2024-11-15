const multer = require('multer');

// Error handling middleware for multer
const errormiddleware = (err, req, res, next) => {
    console.log(`Error at PATH: [${req.method}] [${req.path}]: ${err.message}.`);
    if (err.message) {
        console.log(err.message)
        if (Error instanceof multer.MulterError) {
            switch (err.code) {
                case 'LIMIT_FILE_SIZE':
                    return res.status(400).json({ message: 'File is too large. Maximum size is 5MB.' });
                case 'LIMIT_FILE_COUNT':
                    return res.status(400).json({ message: 'Too many files uploaded.' });
                case 'LIMIT_UNEXPECTED_FILE':
                    return res.status(400).json({ message: 'Unexpected file format.' });
                default:
                    return res.status(400).json({ message: `Multer error: ${err.message}` });
            }

        }
    }
     else if (err) {
        return res.status(500).json({ message: `An unknown error occurred: ${err.message}` });
    }
    next();
};

module.exports = errormiddleware;
