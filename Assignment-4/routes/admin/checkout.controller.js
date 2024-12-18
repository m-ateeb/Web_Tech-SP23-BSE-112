const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart.model");

// Route for checkout page
router.get('/checkout', async (req, res) => {
        try {
          const user = req.user; // Replace with your user-fetching logic
          const { name, email, address } = req.body;
      
          // Save order to database
          const order = new order({
            user: user._id,
            items: user.cart, // Assuming cart is stored in user schema
            totalAmount: user.cart.reduce((total, item) => total + item.quantity * item.price, 0),
            shippingDetails: { name, email, address },
          });
      
          await order.save();
      
          // Clear user's cart
          user.cart = [];
          await user.save();
      
          res.json({ success: true, message: 'Order placed successfully' });
        } catch (error) {
          console.error('Error during checkout:', error);
          res.status(500).json({ success: false, message: 'Error during checkout' });
        }
      });

module.exports = router;


// // Checkout route
//