const mongoose = require("mongoose");

const users=new mongoose.Schema(
    {
       personal_details:{
        name:"string",
        email:"string",
        phonenumber:"string",
        pincode:"string",
        password:"string"
       } 
    }
)

module.exports=mongoose.model("users",users);