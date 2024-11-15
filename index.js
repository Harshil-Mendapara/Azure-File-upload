const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDB = require("./config/config")
const router = require('./routes')
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));

app.use('/api', router);

const PORT = process.env.port
connectDB()
app.listen(PORT, () => {
    console.log(`server running on port http://localhost:${PORT}`)
})