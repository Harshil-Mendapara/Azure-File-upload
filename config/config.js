const { mongoose } = require('mongoose');
require('dotenv').config()

const connectDB  = async () => {
    try {
        await mongoose.connect(`${process.env.DB_URL}/Azure-File-upload`);
        console.log('connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}


module.exports = connectDB ;