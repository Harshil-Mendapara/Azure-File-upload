const express = require('express')
const app = express()

const authRouter = require('./Auth.routes')
const postRouter = require('./post.routes')


app.use('/auth', authRouter);

// post routes
app.use('/post', postRouter);



module.exports = app