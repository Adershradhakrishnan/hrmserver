const mongoose=require('mongoose');

const accesscontrol = new mongoose.Schema(
    {
        token:"string"
    }
);

module.exports=mongoose.model("revoked tokens",accesscontrol)