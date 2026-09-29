const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productspage = require("./routes/products")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = [
  "https://shop-co-hannan4.vercel.app",
  'https://shop-co.vercel.app',
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));




app.use("/data",productspage);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});