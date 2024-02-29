const success_function=require('../utils/response-handler').success_function;
const error_function=require('../utils/response-handler').error_function;
const users=require('../db/models/users');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const {response} =require('express');

exports.adduser = async function(req,res){

    try{

        const name = req.body.name;
        const email = req.body.email;
        const phonenumber = req.body.phonenumber;
        const pincode = req.body.pincode;
        const password = req.body.password;

        const isUserExist = await users.findOne({email});
        console.log("isUserExist: ",isUserExist);

        if(isUserExist){
            let response = error_function({
                statusCode:400,
                message: ('User already exists')
            });
            res.status(response.statusCode).send(response.message);
            return;
        }

        let salt = await bcrypt.genSalt(10);
        console.log("salt: ",salt);

        let hashed_password = bcrypt.hashSync(password,salt);
        console.log("hashed_password: ",hashed_password);

        const new_user = await users.create({
            name,
            email,
            phonenumber,
            pincode,
            password : hashed_password

        });
        let response_obj = {
            name,
            email,
            phonenumber,
            pincode,
            password
        }

        if(new_user){
            let response = success_function({
                statusCode:201,
                data:new_user,
                message: "success"
            });
            res.status(response.statusCode).send(response);
            
        }else {
            response = error_function({
                statusCode: 400,
                message: "failed"
            });
            res.status(response.statusCode).send(response);
        }
    } catch (error) {
        let response = error_function({
            statusCode :400,
            message: "user creation failed"
        });
        res.status(response.statusCode).send(response);
    }
}

exports.getuser = async function (req,res) {
    try{
        const allUsers = await users.find();
        if (allUsers && allUsers.length > 0){

            const response = {
                statusCode:200,
                message: "success",
                data: allUsers
            };
            res.status(200).send(response);
        }else {

            const response = {
                statusCode:404,
                message: "No users found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        console.log("Error fetching users: ",error);
        const response ={
            statusCode: 500,
            message: "Internal server error"
        };
        res.status(500).send(response);
    }
}