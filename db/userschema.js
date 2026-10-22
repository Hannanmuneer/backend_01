const mongoose = require("mongoose");

const userschema = mongoose.Schema({
    email:String,
    password:String,
    age:Number,
    firstname:String,
    lastname:String,
})

const usernotemodel = mongoose.model("user", userschema);
module.exports = usernotemodel; 