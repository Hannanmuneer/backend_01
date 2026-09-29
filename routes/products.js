const express = require("express");
const route = express.Router();

route.get("/newproducts",(req,res)=>{
const newproducts = [
  {
    id: 101,
    name: "Classic Black Hoodie",
    rating: 4.8,
    price: 150,
    originalPrice: 180,
    discount: 15,
    image: "/hoodie.png",
  },
  {
    id: 102,
    name: "Casual Blue Denim Shirt",
    rating: 4.2,
    price: 135,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8082.png",
  },
  {
    id: 103,
    name: "Sporty Windbreaker Jacket",
    rating: 4.6,
    price: 210,
    originalPrice: 250,
    discount: 16,
    image: "https://pngimg.com/uploads/jacket/jacket_PNG8058.png",
  },
  {
    id: 104,
    name: "White Oversized Tee",
    rating: 4.0,
    price: 90,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5449.png",
  },
  {
    id: 105,
    name: "Formal White Dress Shirt",
    rating: 4.9,
    price: 160,
    originalPrice: 200,
    discount: 20,
    image: "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8078.png",
  },
  {
    id: 106,
    name: "Cargo Track Pants",
    rating: 3.8,
    price: 115,
    originalPrice: 130,
    discount: 10,
    image: "https://pngimg.com/uploads/trousers/trousers_PNG10012.png",
  },
  {
    id: 107,
    name: "Graphic Printed Sweatshirt",
    rating: 4.4,
    price: 140,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/sweater/sweater_PNG10034.png",
  },
  {
    id: 108,
    name: "Slim Fit Black Trousers",
    rating: 4.7,
    price: 175,
    originalPrice: 210,
    discount: 16,
    image: "https://pngimg.com/uploads/trousers/trousers_PNG10015.png",
  },
];
  res.status(200).json({
    status: 'success',
    newproducts:newproducts
  });
})

route.get('/products', (req, res) => {
    const products = [
  {
    id: 1,
    name: "T-shirt with Tape Details",
    rating: 4.5,
    price: 120,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
  },
  {
    id: 2,
    name: "Skinny Fit Jeans",
    rating: 3.5,
    price: 240,
    originalPrice: 260,
    discount: 20,
    image: "https://pngimg.com/uploads/jeans/jeans_PNG5775.png",
  },
  {
    id: 3,
    name: "Checkered Shirt",
    rating: 4.5,
    price: 180,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8070.png",
  },
  {
    id: 4,
    name: "Sleeve Striped T-shirt",
    rating: 4.5,
    price: 130,
    originalPrice: 160,
    discount: 30,
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5448.png",
  },
  {
    id: 5,
    name: "Vertical Striped Shirt",
    rating: 5.0,
    price: 212,
    originalPrice: 235,
    discount: 10,
    image: "https://pngimg.com/uploads/dress_shirt/dress_shirt_PNG8117.png",
  },
  {
    id: 6,
    name: "Courage Graphic T-shirt",
    rating: 4.0,
    price: 145,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5438.png",
  },
  {
    id: 7,
    name: "Loose Fit Denim Shorts",
    rating: 3.0,
    price: 80,
    originalPrice: null,
    discount: null,
    image: "https://pngimg.com/uploads/tshirt/tshirt_PNG5450.png",
  },
  {
    id: 8,
    name: "Faded Skinny Jeans",
    rating: 4.5,
    price: 210,
    originalPrice: 250,
    discount: 15,
    image: "https://pngimg.com/uploads/jeans/jeans_PNG5773.png",
  },
];
  res.status(200).json({
    status: 'success',
    products:products
  });
});

module.exports = route;