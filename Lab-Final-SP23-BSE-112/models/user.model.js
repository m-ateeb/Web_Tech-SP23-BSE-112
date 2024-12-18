const mongoose= require("mongoose");
let userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
});
let userModel=mongoose.model("user",userSchema);
module.exports=userModel;