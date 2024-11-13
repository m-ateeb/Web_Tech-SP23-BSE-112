const express = require("express");
let router = express.Router();

router.get("/admin/products", (req, res) => {
  let products = [
    {
      title: "Drink 1",
      price: "RS 100 ",
      description: "Refreshing",
      _id: 1,
    },
    {
      title: "Drink 2",
      price: "RS 140 ",
      description: "Energizing",
      _id: 1,
    },
  ];
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

module.exports = router;
