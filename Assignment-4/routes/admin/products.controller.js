const express = require("express");
let router = express.Router();
let multer=require("multer");
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"./uploads");
},
filename:function(req,file,cb){
  cb(null, `${Date.now()}-${file.originalname}`);
},
});
const upload=multer({storage:storage});
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
router.post("/admin/createproduct",upload.single("file"),
  async(req,res)=>{
  let data=req.body
  let newProduct=new productModel(data);
  newProduct.title=data.title;
  if (req.file) {
    newProduct.picture = req.file.filename;
  }
  await newProduct.save();
  return res.redirect("/admin/products");
});
router.get("/admin/products/:page?", async (req, res) => {
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 1;

  // Get the total number of records
  let totalRecords = await productModel.countDocuments();
  
  // Calculate total pages
  let totalPages = Math.ceil(totalRecords / pageSize);

  // Fetch the products for the current page
  let products = await productModel.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  // Return the products and pagination information
  //res.send({ products, totalPages, currentPage: page });
  //return res.send({ page });
  // Alternatively, you can use res.render if you are rendering HTML pages instead of sending JSON
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
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
