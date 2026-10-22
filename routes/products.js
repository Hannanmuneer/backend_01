const express = require("express");
const route = express.Router();
const ProductSchema = require("../db/productschema");
const NewProductSchema = require("../db/newprodschema");


route.get('/products', async (req, res) => {
  try {
    const productss = await ProductSchema.find();
    res.status(200).json({
      status: 'success',
      productss: productss
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


route.get("/newproducts", async (req, res) => {
  try {
    const newproducts = await NewProductSchema.find();
    res.status(200).json({
      status: 'success',
      products: newproducts
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = route;