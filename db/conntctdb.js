const mongoose = require('mongoose');

try {
    require('dotenv').config();
} catch (error) {
    console.log("dotenv not loaded (production mode)");
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;