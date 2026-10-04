const express = require("express");
const route = express.Router();
const productss = require("../productss.json");
const newproducts = require("../newproducts.json");

route.get("/newproducts",(req,res)=>{
  res.status(200).json({
    status: 'success',
    products: newproducts
  });
});

route.get('/products', (req, res) => {
res.status(200).json({
    status: 'success',
    productss: productss
})
})
  


module.exports = route;