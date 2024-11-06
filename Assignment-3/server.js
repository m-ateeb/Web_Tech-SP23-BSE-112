const express= require("express");
const { Server } = require("http");
let  app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.render("pakola_home-pg");
});
app.get("/portfolio",(req,res)=>{
    res.render("portfolio");
});
app.listen(5000,()=>{
    console.log('Server started at localhost:5000');
})
