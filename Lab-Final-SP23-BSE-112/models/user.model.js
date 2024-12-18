const mongoose = require("mongoose");

// Define the User schema
let userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Add a cart to store items in the user's shopping cart
    cart: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
        },
    ],

    // Add an orders array to store references to the user's order history
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

// Create the User model
let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
