const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const Order = require('../db/orderschema'); 
const Product = require('../db/productschema');    
const NewProduct = require('../db/newprodschema');  
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const frontendUrl = process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith('http') 
  ? process.env.FRONTEND_URL 
  : 'http://localhost:5173';


router.post('/orders', async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;

    const DELIVERY_FEE = 15;
    const DISCOUNT_RATE = 0.2;
    
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const discount = subtotal * DISCOUNT_RATE;
    const totalAmount = subtotal - discount + DELIVERY_FEE;

  
    for (const item of items) {
      const prodId = item.productId || item._id;
      const qty = item.quantity;

     
      let product = await Product.findById(prodId);
      
      if (product) {
       
        if (product.stock < qty) {
          return res.status(400).json({ message: `Product '${product.name}' ka stock mukammal nahi hai!` });
        }
        product.stock -= qty;
        product.sold = (product.sold || 0) + qty;
        await product.save();
      } else {
        
        product = await NewProduct.findById(prodId);
        if (product) {
          if (product.stock < qty) {
            return res.status(400).json({ message: `Product '${product.name}' ka stock mukammal nahi hai!` });
          }
          product.stock -= qty;
          product.sold = (product.sold || 0) + qty;
          await product.save();
        }
      }
    }


    if (paymentMethod === 'online') {
      const newOrder = new Order({
        customer,
        items,
        paymentMethod: 'online',
        totalAmount,
        paymentStatus: 'Pending',
      });
      await newOrder.save();
      
      const session = await stripe.checkout.sessions.create({
        line_items: items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.image ? [item.image] : [],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&orderId=${newOrder._id}`,
        cancel_url: `${frontendUrl}/checkout`,
        metadata: {
          orderId: newOrder._id.toString(),
        },
      });

      newOrder.stripeSessionId = session.id;
      await newOrder.save();

      return res.status(200).json({ paymentUrl: session.url });

    } else {
     
      const newOrder = new Order({
        customer,
        items,
        paymentMethod: 'cod',
        totalAmount,
        paymentStatus: 'Pending', 
        orderStatus: 'Processing'
      });
      await newOrder.save();

      return res.status(200).json({ 
        success: true, 
        orderId: newOrder._id,
        message: 'Order placed successfully via COD' 
      });
    }

  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});


router.get('/verify-payment/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      if (session.payment_status === 'paid') {
        order.paymentStatus = 'Paid';
        await order.save();
      }
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/savedorders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;