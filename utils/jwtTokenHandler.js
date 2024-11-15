const { sign } = require('jsonwebtoken');
require('dotenv').config()

const CreateToken = (data) => {
    return {
        accessToken: sign(data, process.env.ACCESS_KEY, { expiresIn: "7d" }),
        refreshToken: sign(data, process.env.REFRESH_KEY, { expiresIn: "30d" })
    };

}

module.exports = CreateToken;