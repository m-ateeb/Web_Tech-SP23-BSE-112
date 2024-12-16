const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  title: String,
  description: String,
});

// Ensure the model is not overwritten if it already exists in Mongoose models
const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

module.exports = categoryModel;
