require('dotenv').config();
const connectDB = require('./db/conntctdb'); 
const ProductSchema = require('./db/productschema');       
const NewProductSchema = require('./db/newprodschema'); 

const productssData = require('./productss.json');    
const newProductsData = require('./newproducts.json'); 

const runSeeding = async () => {
    await connectDB();

    try {
       
        await ProductSchema.deleteMany({});
        await ProductSchema.insertMany(productssData);
        console.log("Regular products successfully inserted! 🎉");

        await NewProductSchema.deleteMany({});
        await NewProductSchema.insertMany(newProductsData);
        console.log("New products successfully inserted! 🎉");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

runSeeding();