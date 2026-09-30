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

// CORS Middleware Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Postman ya server-to-server requests allowed hain
    if (!origin) return callback(null, true);

    // Exact origin match check
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS Policy restriction'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Pre-flight requests ko explicitly allow karein
app.options('/*', cors());


app.use("/data",productspage);


app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server is running on port ${PORT}`);
});