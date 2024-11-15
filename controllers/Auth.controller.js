const User = require('../model/User.model');
const bcrypt = require('bcrypt');
const CreateToken = require("../utils/jwtTokenHandler");
const jwt = require('jsonwebtoken');
const validator = require("../utils/validator");
const Joi = require("joi");

const createUser = {
    validaton: validator({
        body: Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            username: Joi.string().required(),
            gender: Joi.string().valid('male', 'female', 'other').required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(20).required(),
            confirm_password: Joi.string().min(8).max(20).required(),
        })
    }),

    handler: async (req, res) => {
        const { firstname, lastname, username, gender, email, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            return res.status(404).json({
                success: false,
                message: "Password and confirm password not match"
            });
        }

        try {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: "Email Already exists"
                });
            }

            const user = await new User({
                firstname,
                lastname,
                username,
                gender,
                email,
                password
            });

            await user.save();
            const { accessToken, refreshToken } = CreateToken({ userId: user._id });

            return res.status(201).json({
                success: true,
                message: 'Account created successfully',
                data: user,
                token: {
                    accessToken,
                    refreshToken
                }

            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        }
    }
}


const loginUser = {
    validaton: validator({
        body: Joi.object({
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().min(8).max(20).required(),
        })
    }),
    handler: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username && !email || !password) {
            return res.status(400).json({ success: false, message: "Username or email, and password are required" });
        }

        try {
            const user = await User.findOne({
                $or: [
                    { username },
                    { email }
                ]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User Not found"
                });
            }

            const isValidPassword =  await user.isPasswordCorrect(password)
            if (!isValidPassword) {
                return res.status(401).send({
                    success: false,
                    message: "Invalid password, try again with correct password"
                })
            }

            const { accessToken, refreshToken } = CreateToken({ userId: user._id });
            const data = await User.findById(user._id).select('-password');

            return res.status(200).json({
                success: true,
                message: 'User loggedin successfully',
                user: data,
                token: {
                    accessToken,
                    refreshToken
                }
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        }
    }
}



const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: 'Refresh token is required'
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
        const token = CreateToken({ userId: decoded.userId });

        return res.status(200).json({
            success: true,
            message: 'New tokens generated',
            newTokens: token
        });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};



module.exports = {
    createUser,
    loginUser,
    refreshToken,
}