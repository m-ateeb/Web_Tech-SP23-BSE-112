const express= require("express");
const { Server } = require("http");
let  app = express();
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
app.set("view engine","ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded());

let adminProductsRouter = require("./routes/admin/products.controller");
app.use(adminProductsRouter);

app.get("/",(req,res)=>{
    res.render("pakola_home-pg");
});
app.get("/", async (req, res) => {
    let Product = require("./models/product.model");
    let products = await Product.find();
    return res.render("homepage", { products });
  });

let connectionString="mongodb://localhost:27017/Pakola_Web"
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));
app.get("/portfolio",(req,res)=>{
    res.render("portfolio");
});
app.listen(3000,()=>{
    console.log('Server started at http://localhost:3000');
});
