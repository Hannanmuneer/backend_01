


const express = require('express');
const cors = require('cors');
require('dotenv').config();

const productspage = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;



const allowedOrigins = [
  "https://shop-co-hannan4.vercel.app",
  "https://shop-co.vercel.app",
  "http://localhost:5173"
];

// 1. Single Global CORS Middleware (Handles GET, POST, OPTIONS, etc.)
app.use(cors({
  origin: (origin, callback) => {
    // Postman ya direct server-to-server calls ke liye allowed
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy restriction'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. Routes
app.use("/data", productspage);

// 3. Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});