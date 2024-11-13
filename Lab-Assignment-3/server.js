const express= require("express");
const { Server } = require("http");
let  app = express();
var expressLayouts = require("express-ejs-layouts");
app.set("view engine","ejs");
app.use(expressLayouts);
app.use(express.static("public"));
let adminProductsRouter = require("./routes/admin/products.controller");
app.use(adminProductsRouter);

app.get("/",(req,res)=>{
    res.render("pakola_home-pg");
});
app.get("/admin/products",(req,res)=>{
    res.render("/admin/products");
});
app.get("/admin/createproduct", (req, res) => {
    res.render("admin/createproduct");  
});


app.get("/portfolio",(req,res)=>{
    res.render("portfolio");
});
app.listen(5000,()=>{
    console.log('Server started at localhost:5000');
})
