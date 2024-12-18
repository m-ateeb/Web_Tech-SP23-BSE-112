const express = require("express");
const { Server } = require("http");
let app = express();
let Product = require("./models/product.model");
const Cart = require("./models/cart.model");
const flash = require("connect-flash");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let User = require("./models/user.model");
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
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});
app.get("/add-to-cart/:id", (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  return res.redirect("/");
});
// Update product quantity in the cart
app.post('/update-quantity/:id', async (req, res) => {
  const productId = req.params.id;
  const action = req.body.action; // "increase" or "decrease"
  const newQuantity = parseInt(req.body.quantity, 10);

  // Ensure user is logged in
  
  try {
      // Find the cart associated with the logged-in user
      const cart = await Cart.findOne({ userId: req.user});

      // Check if the product exists in the cart
      const productInCart = cart.products.find(item => item.productId.toString() === productId);

      if (!productInCart) {
          return res.redirect('/cart');
      }

      // Update the quantity
      if (action === 'increase') {
          productInCart.quantity += 1;
      } else if (action === 'decrease' && productInCart.quantity > 1) {
          productInCart.quantity -= 1;
      }

      await cart.save();
      res.redirect('/cart');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

//remove from cart
app.get('/remove-from-cart/:id', async (req, res) => {
  const productId = req.params.id;  // Get the productId from the URL
  
  // Ensure user is logged in
  if (!req.user) {
      return res.redirect('/login');
  }

  try {
      // Find the cart associated with the logged-in user
      const cart = await Cart.findOne({ userId: req.user } );
      if (!cart) {
          return res.redirect('/cart');  // If cart doesn't exist
      }

      // Remove the product from the cart
      cart.products = cart.products.filter(product => product.productId.toString() !== productId);
      await cart.save();

      // Redirect to the cart page after removal
      res.redirect('/cart');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});

let connectionString = "mongodb://localhost:27017/Pakola";
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
