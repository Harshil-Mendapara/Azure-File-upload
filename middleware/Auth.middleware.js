const jwt = require('jsonwebtoken');
require('dotenv').config()


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({
            success: false,
            message: 'Token not valid, please  provide valid token'
        })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).send({
            success: false,
            message: 'Invalid use of auth Token'
        })
    }

    try {
        const user = jwt.verify(token, process.env.ACCESS_KEY);
        if (!user) {
            return res.status(400).send({
                success: false,
                message: 'UnAuthorized'
            })
        }
        req.user = user
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
}

module.exports = authenticateToken