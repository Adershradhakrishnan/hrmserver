const mongoose = require("mongoose");

const user=new mongoose.Schema(
    {
       personal_details:{
        email:"string",
        password:"string",
        phonenumber:"string",
        address:"string",
        pincode:"string"
       } 
    }
)