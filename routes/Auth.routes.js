const router = require('express').Router();
const { createUser, loginUser, refreshToken } = require('../controllers/Auth.controller');

router.post('/signup', createUser.validaton, createUser.handler);
router.post('/signin', loginUser.validaton, loginUser.handler);
router.post('/refresh-token', refreshToken);

module.exports = router;