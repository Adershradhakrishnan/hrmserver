const success_function=require('../utils/response-handler').success_function;
const error_function=require('../utils/response-handler').error_function;
const users=require('../db/models/users');
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const express =require('express');
const validateadduser=require('../validations/adduser_validation');

exports.adduser = async function(req,res){

    try{

        const {name, email, phonenumber, pincode, password} = req.body;

        console.log(req.body);

        const{usererrors,userValid} = await validateadduser(req.body);

        console.log("usererrors: ",usererrors);
        console.log("userValid: ",userValid);


        if(!userValid) {
           let response = error_function({
            statusCode:400,
            message:"validation error"
           });
           response.errors = usererrors;
           res.status(response.statusCode).send(response);
           return;
        } else{

            let user_type_id="65e99895550c5c1f798ca45c"
            console.log(user_type_id);
            
            if(phonenumber.length !== 10){
                let response = error_function({
                    statusCode:400,
                    message: 'phonenumber should be 10 digits.'
                });
                res.status(response.statusCode).send(response);
                return;
            }
                if(pincode.length !==6) {
                    let response = error_function({
                        statusCode:400,
                        message: 'pincode should be 6 digits.'
                    });
                    res.status(response.statusCode).send(response);
                    return;
                }
                const isUserExist = await users.findOne({email});
                console.log("isUserExist: ",isUserExist);
        
                if(isUserExist){
                    let response = error_function({
                        statusCode:400,
                        message: 'User already exists'
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
                    password : hashed_password,
                    user_type: user_type_id
        
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
                        message: 'User created successfully'
                    });
                    res.status(response.statusCode).send(response);
                    
                }else {
                   let response = error_function({
                        statusCode: 400,
                        message: 'failed to create user'
                    });
                    res.status(response.statusCode).send(response);
                }
        }
        

     
    } catch (error) {
        let response = error_function({
            statusCode :400,
            message: 'user creation failed'
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

exports.router = async function (req,res) {
    try{
        const userId = req.params.userId;
        const user = await users.findById(userId);
        if(!user) {
            return res.status(404).json({ error: 'User not found'});
        }

        res.json(user);
    } catch (error) {
        console.log('Error fetching user details:',error);
        res.status(500).json({ error: 'Server error'});
    }
};

exports.Updateuser= async function(req,res){

    const userId = req.params.userId;
    const userData = req.body;

    try{
        const updateuser= await users.findByIdAndUpdate(userId,userData,{new: true});

        if (updateuser) {
            const response = {
                statusCode: 200,
                message: "User updated successfully",
                data: updateuser
            };
            res.status(200).send(response);
        } else{
            const response = {
                statusCode: 404,
                message: "User not found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        console.log("Error updating user:",error);
        const response = {
            statusCode: 500,
            message: "Internal server error"
        };
        res.status(500).send(response);
    }
}