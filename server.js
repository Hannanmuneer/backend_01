const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productspage = require("./routes/products")
const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));


app.use("/data",productspage);





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});