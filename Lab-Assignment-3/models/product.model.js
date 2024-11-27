const mongoose=require("mongoose");

let categoryschema=mongoose.Schema({
    category:String,
    description:String,
});
let categoryModel=mongoose.model("Category",categoryschema);
let productschema=mongoose.Schema({
    title:String,
    description:String,
    price:Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "categoryModel", required: true },
});

let productModel=mongoose.model("Product",productschema);
module.exports={categoryModel,productModel};