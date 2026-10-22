const mongoose = require("mongoose");

const newproductSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    image: { type: String, required: true },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 }
});


module.exports = mongoose.models.newProduct || mongoose.model("newProduct", newproductSchema);