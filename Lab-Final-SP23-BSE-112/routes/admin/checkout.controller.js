const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
const Order = require('../../models/order.model'); // Assuming you have an order model
const cookieParser = require('cookie-parser');

// Middleware to parse cookies
router.use(cookieParser());

// GET method for Checkout
router.get('/checkout', async (req, res) => {
  try {
    // Fetch the user ID from the cookies
    const userId = req.cookies.userId;  // Assuming userId is stored in cookies
    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found. Please log in." });
    }

    // Fetch the user from the database using the userId from cookies
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found in database." });
    }

    // Fetch the cart from cookies
    const cart = req.cookies.cart || [];
    if (!cart || cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    // Calculate the total amount from the cart items
    const totalAmount = cart.reduce((total, item) => total + item.quantity * item.price, 0);

    // Render the checkout page
    res.render('checkout', { cart, totalAmount, user });

  } catch (error) {
    console.error("Error fetching checkout page:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST method for Checkout (Place the order)
router.post('/checkout', async (req, res) => {
  try {
    // Fetch the cart from cookies
    let cart = req.cookies.cart || [];
    if (cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    // Fetch user from cookies
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: error});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found in database." });
    }

    // Shipping details from the request body
    const { name, email, address } = req.body;
    if (!name || !email || !address) {
      return res.status(400).json({ success: false, message: "Shipping details are required." });
    }

    // Calculate total amount from cart items
    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    if (isNaN(totalAmount)) {
        throw new Error('Invalid total amount');
    }
        res.render('checkout', { cart, totalAmount, user });
    // Create a new order document
    const order = new Order({
      user: user._id,       // Save the user ID
      items: cart,          // Store the cart items
      totalAmount,          // Total amount from cart
      shippingDetails: { name, email, address }, // Shipping details
    });

    // Save the order to the database
    await order.save();

    // Clear the cart from cookies after placing the order
    res.clearCookie('cart');

    // Return a success response
    res.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ success: false, message: "Error during checkout" });
  }
});


module.exports = router;
