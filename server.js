const express = require('express');
const cors = require('cors');
require('dotenv').config();
const productspage = require("./routes/products")
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const allowedOrigins = [
  "https://shop-co-hannan4.vercel.app",
  "https://shop-co.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    // Postman ya direct server requests (jaha origin undefined hota hai) allow hongi
    if (!origin) return callback(null, true);

    // Dynamic vercel preview links match karne ke liye includes ya regex check
    const isAllowed = allowedOrigins.some(o => origin === o || origin.endsWith(".vercel.app"));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use("/data",productspage);


app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});