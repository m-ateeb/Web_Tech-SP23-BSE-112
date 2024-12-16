const express= require("express");
const { Server } = require("http");
let  app = express();
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let  User=require("./models/user.model");
let cookieParser=require("cookie-parser");
app.use(cookieParser());
let session = require("express-session");
app.use(session({ secret: "my session secret" }));

let siteMiddleware = require("./middlewares/site-middleware");
let authMiddleware = require("./middlewares/auth-middleware");
app.use(siteMiddleware);

app.set("view engine","ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded());


let adminProductsRouter = require("./routes/admin/products.controller");
app.use(adminProductsRouter);
let adminCategoryRouter = require("./routes/admin/category.controller");
app.use(adminCategoryRouter);








app.get("/",(req,res)=>{
    res.render("pakola_home-pg");
});
app.get("/", async (req, res) => {
    let Product = require("./models/product.model");
    let products = await Product.find();
    return res.render("homepage", { products });
  });
app.get("/admin/category", async (req, res) => {
    let Categorys = require("./models/category.model");
    let category = await Categorys.find();
    return res.render("admin/category", { category });
  });



  app.get("/logout", async (req, res) => {
    req.session.user = null;
    return res.redirect("/login");
  });
  app.get("/login", async (req, res) => {
    return res.render("auth/login");
  });
  app.post("/login", async (req, res) => {
    let data = req.body;
    let user = await User.findOne({ email: data.email });
    if (!user) return res.redirect("/register");
    isValid = user.password == data.password;
    if (!isValid) return res.redirect("/login");
    req.session.user = user;
    return res.redirect("/");
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
const adminsMiddleware = require("./middlewares/admin-middleware");
app.use("/", authMiddleware, adminsMiddleware, adminProductsRouter);

  
let connectionString="mongodb://localhost:27017/Pakola"
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

app.listen(3000,()=>{
    console.log('Server started at http://localhost:3000');
});
