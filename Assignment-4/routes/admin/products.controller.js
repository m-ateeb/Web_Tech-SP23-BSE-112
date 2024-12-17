const express = require("express");
let router = express.Router();
let multer = require("multer");
const productModel = require("../../models/product.model");
const categoryModel = require("../../models/category.model"); // Assuming you have a category model
const searchSortMiddleware = require("../../middlewares/searchsort-middleware");
const cloudinary = require("../../config/cloudinary.config"); // Import your Cloudinary config

// Multer configuration to store images in memory (instead of saving to disk)
const storage = multer.memoryStorage(); // Store the image in memory (no local file saving)
const upload = multer({ storage: storage });

// Route to render the "Create Product" form with categories
router.get("/admin/createproduct", async (req, res) => {
  try {
    // Fetch categories from the database
    let categories = await categoryModel.find();
    return res.render("admin/createproduct", {
      layout: "adminlayout",
      categories, // Pass categories to the form
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Error fetching categories");
  }
});

// Route to handle product creation
router.post("/admin/createproduct", upload.single("file"), async (req, res) => {
  let data = req.body;

  // Log the request details for debugging
  console.log("Received Data:", data);
  console.log("Received File:", req.file);

  let newProduct = new productModel({
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category, // Category ID from the select dropdown
  });

  try {
    if (req.file) {
      console.log("Uploading image to Cloudinary...");

      // Upload the image to Cloudinary using the buffer from memory
      cloudinary.uploader.upload_stream(
        { resource_type: "image" }, // Specify it's an image
        async (error, cloudinaryResult) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).send("Error uploading image");
          }

          console.log("Cloudinary Upload Success:", cloudinaryResult);
          // Set the Cloudinary URL to the product's picture field
          newProduct.picture = cloudinaryResult.secure_url; // Cloudinary image URL

          try {
            // Save the product with the image URL
            await newProduct.save();
            console.log("Product saved successfully");
            return res.redirect("/admin/products"); // Redirect to products page
          } catch (saveError) {
            console.error("Error saving product:", saveError);
            return res.status(500).send("Error saving product");
          }
        }
      ).end(req.file.buffer); // Upload image buffer to Cloudinary
    } else {
      // If no image is uploaded, save the product without a picture
      console.log("No file uploaded, saving product without picture");
      await newProduct.save();
      return res.redirect("/admin/products");
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).send("Error creating product");
  }
});

// Route to fetch and display all products with search, sort, and pagination
router.get("/admin/products", searchSortMiddleware, async (req, res) => {
  try {
    // Fetch unique categories for filtering
    const categories = await categoryModel.find();

    // Use results from middleware
    const { products, totalPages, page, pageSize, totalRecords, filter } = res.locals;

    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
      totalPages,
      page,
      pageSize,
      totalRecords,
      categories, // Categories for filter dropdown
      searchQuery: filter.search || "",
      selectedCategory: filter.category || "",
      sortOption: filter.sort || "",
    });
  } catch (error) {
    console.error("Error rendering products:", error);
    res.status(500).send("Error rendering products.");
  }
});

// Route to delete a product
router.get("/admin/deleteproduct/:id", async (req, res) => {
  try {
    let params = req.params.id;
    await productModel.findByIdAndDelete(params);
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Error deleting product");
  }
});

// Route to render the "Edit Product" form
router.get("/admin/editproduct/:id", async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id).populate("category");
    let categories = await categoryModel.find(); // Fetch categories for editing
    return res.render("admin/editproduct", {
      layout: "adminlayout",
      product,
      categories, // Pass categories to the form
    });
  } catch (error) {
    console.error("Error fetching product or categories:", error);
    res.status(500).send("Error fetching product or categories");
  }
});

// Route to handle product updates
router.post("/admin/editproduct/:id", upload.single("file"), async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.category = req.body.category; // Update category

    if (req.file) {
      product.picture = req.file.filename;
    }

    await product.save();
    return res.redirect("/admin/products");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
});

module.exports = router;
