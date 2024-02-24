const mongoose = require("mongoose");

const user=new mongoose.Schema(
    {
       personal_details:{
        name:"string",
        email:"string",
        phonenumber:"string",
        
        password:"string"
       } 
    }
)