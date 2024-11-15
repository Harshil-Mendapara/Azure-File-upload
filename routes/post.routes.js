router = require('express').Router();
const authenticateToken = require('../middleware/Auth.middleware');
const { postUpload } = require('../middleware/fileUpload.middleware');
const { createPost, showPost } = require('../controllers/Post.controller');
const errormiddleware = require('../middleware/errorMiddleware');


// post upload routes
const uploadImage = postUpload.single('post')
router.post('/create', authenticateToken, uploadImage, errormiddleware, createPost);
router.get('/showPost/:id',authenticateToken, showPost);

module.exports = router;