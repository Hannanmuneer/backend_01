const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const connectDB = require('./db/conntctdb');
const productspage = require("./routes/products");
const orders = require('./routes/orders');
const ordersschema = require("./db/orderschema")
const usernotemodel = require('./db/userschema');
const adminschema = require('./db/adminschema');
const verifyAdmin = require("./middleware/verifyadmin");
const ProductSchema = require("./db/productschema");
const NewProductSchema = require("./db/newprodschema");
const multer = require("multer");
const uploadImage = require("./services/storage.services");


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB(); 

const upload = multer({storage:multer.memoryStorage()})

const allowedOrigins = [
  "https://shop-co-hannan4.vercel.app",
  "https://shop-co.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174"
];


app.use(cors({
  origin: (origin, callback) => {
    
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

const generateCustomId = async () => {
    const lastProduct = await ProductSchema.findOne().sort({ id: -1 });
    const lastNewProduct = await NewProductSchema.findOne().sort({ id: -1 });
    
    const maxId1 = lastProduct ? lastProduct.id : 0;
    const maxId2 = lastNewProduct ? lastNewProduct.id : 0;
    
    return Math.max(maxId1, maxId2) + 1;
};


app.post("/create-product", verifyAdmin, upload.single("image"), async (req, res) => {
    try {
        const { name, price, stock, originalPrice, discount, rating, productType } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Product image is required!" });
        }

        const fileName = `product_${Date.now()}_${req.file.originalname}`;

     
        const result = await uploadImage(req.file.buffer, fileName);

        if (!result || !result.url) {
            return res.status(500).json({ error: "Image upload failed!" });
        }

        const TargetSchema = productType === "new" ? NewProductSchema : ProductSchema;

        const lastProduct = await TargetSchema.findOne().sort({ id: -1 });
        const newId = lastProduct ? lastProduct.id + 1 : 1;

       
        const newProduct = new TargetSchema({
            id: newId,
            name: name,
            price: Number(price),
            stock: Number(stock) || 0,
            rating: Number(rating) || 5,
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            discount: discount ? Number(discount) : undefined,
            image: result.url, 
            sold: 0
        });

        await newProduct.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            product: newProduct
        });

    } catch (err) {
        console.error("Create Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/create', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    let existingUser = await usernotemodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    let saltrond = 10;
    let encryptedPassword = await bcrypt.hash(password, saltrond);

    let newUser = await usernotemodel.create({
      name,
      email,
      password: encryptedPassword
    });

    
    let token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || 'your_fallback_secret_key',
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error("User Creation Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user = await usernotemodel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

   
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    
    res.cookie('token', token, { httpOnly: true });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




app.use("/data", productspage);

app.use("/api",orders );


app.post("/adminlogin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await adminschema.findOne({ email });

        if (!user) return res.status(404).json({ error: "Admin nahi mila" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Galat password" });

        
        const token = jwt.sign(
            { id: user._id, email: user.email, role: "admin" }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        res.status(200).json({ 
            message: "Login successful", 
            token, 
            role: "admin" 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put("/update-order/:id", verifyAdmin, async (req, res) => {
    try {
        const newStatus = req.body.orderstatus || req.body.orderStatus;

        console.log("--- Update Order Called ---");
        console.log("Requested Status:", newStatus);

       
        const order = await ordersschema.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const oldStatus = order.orderstatus || order.orderStatus;

      
        if ((newStatus === "Delivered" || newStatus === "Shipped") && oldStatus !== newStatus) {
            
            for (const item of order.items) {
                const targetId = item.id || item.productId || item._id;
                const qty = Number(item.quantity || 1);

                console.log(`Processing Item -> ID: ${targetId}, Qty: ${qty}`);

                if (!targetId) {
                    console.log("❌ Item ID missing!");
                    continue;
                }

                let updatedProduct = null;
                const numericId = Number(targetId); 

            
                updatedProduct = await ProductSchema.findOneAndUpdate(
                    { id: numericId },
                    { $inc: { stock: -qty, sold: qty } },
                    { new: true }
                );

                
                if (!updatedProduct) {
                    updatedProduct = await NewProductSchema.findOneAndUpdate(
                        { id: numericId },
                        { $inc: { stock: -qty, sold: qty } },
                        { new: true }
                    );
                }

                if (updatedProduct) {
                    console.log(`Stock & Sold updated for product: ${updatedProduct.name}`);
                } else {
                    console.log(` Product could not be found in DB for ID: ${targetId}`);
                }
            }
        }

      
        const updatedPost = await ordersschema.findByIdAndUpdate(
            req.params.id, 
            { orderstatus: newStatus, orderStatus: newStatus }, 
            { new: true }
        );

        res.status(200).json({ message: "Order updated & stock adjusted successfully", updatedPost });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: err.message });
    }
});



app.get("/product-sales", async (req, res) => {
    try {
  
        const regularProducts = await ProductSchema.find({});
        const newProducts = await NewProductSchema.find({});

     
        let allProducts = [...regularProducts, ...newProducts];

        
        allProducts.sort((a, b) => (b.sold || 0) - (a.sold || 0));

        
        const totalItemsSold = allProducts.reduce((sum, p) => sum + (p.sold || 0), 0);

       
        res.status(200).json({
            success: true,
            totalItemsSold, 
            products: allProducts
        });

    } catch (err) {
        console.error("Sales fetch error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.get("/getorders", async (req, res) => {
    try {
        const orders = await ordersschema.find(); 
          res.status(200).json({ 
            message: "Orders fetched successfully", 
            orders 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }        
});

app.get("/getallproducts", async (req, res) => {
    try {
       
        const [newproducts, productss] = await Promise.all([
            NewProductSchema.find(),
            ProductSchema.find()
        ]);

        res.status(250).json({
            status: 'success',
            productss: productss,
            newproducts: newproducts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }        
});


app.delete("/delete-product/:id", verifyAdmin, async (req, res) => {
    try {
        const targetId = req.params.id;
        let deletedProduct = null;

        
        try {
            deletedProduct = await ProductSchema.findByIdAndDelete(targetId);
        } catch (e) { }

        if (!deletedProduct) {
            deletedProduct = await ProductSchema.findOneAndDelete({ 
                $or: [{ id: targetId }, { id: Number(targetId) }] 
            });
        }

      
        if (!deletedProduct) {
            try {
                deletedProduct = await NewProductSchema.findByIdAndDelete(targetId);
            } catch (e) {}
        }

        if (!deletedProduct) {
            deletedProduct = await NewProductSchema.findOneAndDelete({ 
                $or: [{ id: targetId }, { id: Number(targetId) }] 
            });
        }

       
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found in database!" });
        }

        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (err) {
        console.error("Delete Product Error:", err);
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

