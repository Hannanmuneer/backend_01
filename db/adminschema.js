

const mongoose = require("mongoose");

const adminschema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("admin", adminschema);