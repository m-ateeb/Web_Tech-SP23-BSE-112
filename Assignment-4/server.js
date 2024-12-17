const express= require("express");
const { Server } = require("http");
let  app = express();
let Product = require("./models/product.model");
const flash = require('connect-flash');
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let  User=require("./models/user.model");
let cookieParser=require("cookie-parser");
app.use(cookieParser());
let session = require("express-session");
app.use(session({ secret: "my session secret" }));
app.use(flash());

let siteMiddleware = require("./middlewares/site-middleware");
let authMiddleware = require("./middlewares/auth-middleware");
app.use(siteMiddleware);

app.set("view engine","ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded());


let adminProductsRouter = require("./routes/admin/products.controller");
app.use(adminProductsRouter);
let adminCategoryRouter = require("./routes/admin/category.controller");
app.use(adminCategoryRouter);


const path = require('path');

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






app.get("/", async (req, res) => {
  // Fetch products and user session in a single route handler
  let Product = require("./models/product.model");
  let products = await Product.find();

  // Render the page with both products and user session
  res.render("pakola_home-pg", {
      user: req.session.user,
      products: products
  });
});

app.get("/admin/category", async (req, res) => {
    let Categorys = require("./models/category.model");
    let category = await Categorys.find();
    return res.render("admin/category", { category });
  });



  app.get("/logout", async (req, res) => {
    req.session.user = null;
    res.clearCookie('connect.sid');  // Clear session cooki
    req.flash('success', 'You have been logged out.');
    return res.redirect("/");
  });
  
  app.get("/login", (req, res) => {
    res.render('auth/login', {
      messages: req.flash()  // Ensure messages are passed to the view
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
      req.flash('success', 'Login successful!');
    
      // Redirect admin users to the admin products page
      if (user.role === 'admin') {
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
app.post('/update-cart/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;

  // Find product in the cart and update quantity
  let cart = req.session.cart || [];
  let productIndex = cart.findIndex(item => item._id.toString() === productId);

  if (productIndex !== -1) {
      cart[productIndex].quantity = quantity;
      req.session.cart = cart;
      return res.json({ success: true });
  } else {
      return res.json({ success: false, message: 'Product not found in cart.' });
  }
});
// Remove product from the cart
app.get('/remove-from-cart/:id', (req, res) => {
  const productId = req.params.id;

  let cart = req.session.cart || [];
  cart = cart.filter(item => item._id.toString() !== productId);

  req.session.cart = cart;

  res.redirect('/cart');
});

// Checkout route
app.post('/checkout', (req, res) => {
  const { name, email, address } = req.body;
  const cart = req.session.cart || [];

  if (!name || !email || !address || cart.length === 0) {
      return res.json({ success: false, message: 'Please complete the form and ensure your cart has items.' });
  }

  // Here, you can save the order to your database or handle any other logic
  // Assuming everything is correct, clear the cart after checkout
  req.session.cart = [];

  return res.json({ success: true });
});


let connectionString="mongodb://localhost:27017/Pakola"
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

app.listen(3000,()=>{
    console.log('Server started at http://localhost:3000');
});
