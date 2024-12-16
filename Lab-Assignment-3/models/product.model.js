const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  picture:String,
  price: Number,
});

// Check if the model already exists to prevent overwriting it
const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = productModel;  // Export the model correctly
