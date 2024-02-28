const success_function=require('../utils/response-handler').success_function;
const error_function=require('../utils/response-handler').error_function;
const users=require('../db/models/users');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const dotenv=require('dotenv');

exports.adduser = async function(req,res){

    try{

        const name = req.body.name;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber;
        const pincode = req.body.pincode;
        const password = req.body.password;

        const isUserExist = await users.findOne({email});
        console.log("isUserExist: ",isUserExist);

        if(!isUserExist){
            let response = error_function({
                statusCode:400,
                message: "already exists"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        let salt = await bcrypt.genSalt(10);
        console.log("salt: ",salt);

        let hashed_password = await bcrypt.hashSync(password,salt);
        console.log("hashed_password: ",hashed_password);

        const new_user = {
            name,
            email,
            phonenumber,
            pincode,
            password

        }
        if(!new_user){
            let response = success_function({
                statusCode:201,
                data:new_user,
                message: "success"
            });
            res.status(response.statusCode).send(response);
            return;
        }


    }
}