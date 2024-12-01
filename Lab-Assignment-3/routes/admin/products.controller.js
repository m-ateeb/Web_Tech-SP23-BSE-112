const express = require("express");
let router = express.Router();
let  productModel  = require("../../models/product.model");
router.get("/admin/createproduct",(req,res)=>{
  return res.render("admin/createproduct",{layout:"adminlayout"});
});




//admin page route
router.get("/admin/admin",async (req, res) => {
  let products = await productModel.find();
  return res.render("admin", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});
router.post("/admin/createproduct",async(req,res)=>{
  let data=req.body
  let newProduct=new productModel(data);
  newProduct.title=data.title;
  await newProduct.save();
  return res.redirect("/admin/products");
});
router.get("/admin/products",async (req, res) => {
  let products = await productModel.find();
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});
router.get("/admin/deleteproduct/:id", async (req, res) => {
  let params = req.params.id;
  let product = await productModel.findByIdAndDelete(req.params.id);
  // let query = req.query;
  // return res.send({ query, params });
  // return res.send(product);
  return res.redirect("/admin/products");
});

//route to render edit product form
router.get("/admin/editproduct/:id", async (req, res) => {
  let product = await productModel.findById(req.params.id);
  return res.render("admin/editproduct", {
    layout: "adminlayout",
    product,
  });
});
router.post("/admin/editproduct/:id", async (req, res) => {
  let product = await productModel.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
});


module.exports = router;
