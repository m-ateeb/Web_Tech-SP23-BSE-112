const express = require("express");
let router = express.Router();
let categoryModel = require("../../models/category.model");
router.get("/admin/createcategory",(req,res)=>{
  return res.render("admin/createcategory",{layout:"adminlayout"});
});

router.post("/admin/createcategory",async(req,res)=>{
  let data=req.body
  let newcategory=new categoryModel(data);
  newcategory.title=data.title;
  await newcategory.save();
  return res.redirect("/admin/category");
});
router.get("/admin/category",async (req, res) => {
  let category = await categoryModel.find();
  return res.render("admin/category", {
    layout: "adminlayout",
    pageTitle: "Manage Your category",
    category,
  });
});
router.get("/admin/deletecategory/:id", async (req, res) => {
  let params = req.params.id;
  let category = await categoryModel.findByIdAndDelete(req.params.id);
  // let query = req.query;
  // return res.send({ query, params });
  // return res.send(category);
  return res.redirect("/admin/category");
});

//route to render edit category form
router.get("/admin/editcategory/:id", async (req, res) => {
  let category = await categoryModel.findById(req.params.id);
  return res.render("admin/editcategory", {
    layout: "adminlayout",
    category,
  });
});
router.post("/admin/editcategory/:id", async (req, res) => {
  let category = await categoryModel.findById(req.params.id);
  category.title = req.body.title;
  category.description = req.body.description;
  category.price = req.body.price;
  await category.save();
  return res.redirect("/admin/category");
});


module.exports = router;
