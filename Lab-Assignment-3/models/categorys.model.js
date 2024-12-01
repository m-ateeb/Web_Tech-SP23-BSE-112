const mongoose=require("mongoose");
let categorysschema=mongoose.Schema({
    title:String,
    description:String,
});

let categorysModel=mongoose.model("Categorys",categorysschema);
module.exports={categorysModel};