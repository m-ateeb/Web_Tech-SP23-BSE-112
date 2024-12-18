const express = require("express");
const { Server } = require("http");
let app = express();
let Product = require("./models/product.model");
let User = require("./models/user.model");
let Order=require("./models/order.model");
const Cart = require("./models/cart.model");
const flash = require("connect-flash");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let session = require("express-session");
app.use(session({ secret: "my session secret" }));
app.use(flash());

let siteMiddleware = require("./middlewares/site-middleware");
let authMiddleware = require("./middlewares/auth-middleware");
app.use(siteMiddleware);

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded());

let adminProductsRouter = require("./routes/admin/products.controller");
app.use(adminProductsRouter);
let adminCategoryRouter = require("./routes/admin/category.controller");
app.use(adminCategoryRouter);
let adminOrderRouter= require("./routes/admin/order.controller");
app.use(adminOrderRouter);
let adminCheckoutRouter= require("./routes/admin/checkout.controller");
app.use(adminCheckoutRouter);

const path = require("path");

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", async (req, res) => {
  // Fetch products and user session in a single route handler
  let Product = require("./models/product.model");
  let products = await Product.find();

  // Render the page with both products and user session
  res.render("pakola_home-pg", {
    user: req.session.user,
    products: products,
  });
});

app.get("/admin/category", async (req, res) => {
  let Categorys = require("./models/category.model");
  let category = await Categorys.find();
  return res.render("admin/category", { category });
});

app.get("/logout", async (req, res) => {
  req.session.user = null;
  res.clearCookie("connect.sid"); // Clear session cooki
  req.flash("success", "You have been logged out.");
  return res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("auth/login", {
    messages: req.flash(), // Ensure messages are passed to the view
  });
});

app.post("/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });

  if (!user) return res.redirect("/register");

  res.cookie('userId', user._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Prevents CSRF
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  let isValid = user.password == data.password;
  if (!isValid) return res.redirect("/login");

  // Store user data in session (including role)
  req.session.user = { id: user._id, email: user.email, role: user.role };

  // Flash a success message for any user who logs in successfully
  req.flash("success", "Login successful!");

  // Redirect admin users to the admin products page
  if (user.role === "admin") {
    return res.redirect("/admin/products");
  }

  // For non-admin users, redirect to their desired page or home
  let redirectUrl = req.query.redirect || "/";
  return res.redirect(redirectUrl);
});

app.get("/register", async (req, res) => {
  return res.render("auth/register");
});

app.post("/register", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });
  if (user) return res.redirect("/register");
  user = new User(data);
  await user.save();
  return res.redirect("/login");
});

const adminMiddleware = require("./middlewares/admin-middleware");
app.use("/", authMiddleware, adminMiddleware, adminProductsRouter);

app.get("/cart", async (req, res) => {
  // Retrieve cart from cookies
  let cart = req.cookies.cart || []; // Default to empty if no cookie is present

  try {
      // Fetch products from database based on cart items
      const products = await Product.find({ _id: { $in: cart.map(item => item.productId) } });

      // Map quantities to the fetched products
      const cartDetails = products.map(product => {
          const cartItem = cart.find(item => item.productId === product._id.toString());
          return {
              ...product.toObject(), // Convert Mongoose document to plain object
              quantity: cartItem ? cartItem.quantity : 1,
          };
      });

      // Pass the data to the view
      res.render("cart", { products: cartDetails });
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
  }
});


app.get("/add-to-cart/:id", (req, res) => {
  const productId = req.params.id;
  let cart = req.cookies.cart || [];
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
      existingItem.quantity += 1;
  } else {
      cart.push({ productId, quantity: 1 });
  }
  res.cookie("cart", cart);
  res.redirect("/cart");
});

app.post("/update-quantity/:id", (req, res) => {
  const productId = req.params.id;
  const action = req.body.action;
  let cart = req.cookies.cart || [];
  const cartItem = cart.find(item => item.productId === productId);
  if (cartItem) {
      if (action === "increase") cartItem.quantity += 1;
      else if (action === "decrease" && cartItem.quantity > 1) cartItem.quantity -= 1;
  }
  res.cookie("cart", cart);
  res.redirect("/cart");
});

app.get("/remove-from-cart/:id", (req, res) => {
  const productId = req.params.id;
  let cart = req.cookies.cart || [];
  cart = cart.filter(item => item.productId !== productId);
  res.cookie("cart", cart);
  res.redirect("/cart");
});

let connectionString = "mongodb://localhost:27017/Pakola";
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
