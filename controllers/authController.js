let success_function=require('../utils/response-handler').success_function;
let error_function=require('../utils/response-handler').error_function;
const users =require('../db/models/users');
let jwt = require('jsonwebtoken');
let bcrypt =require('bcryptjs');
let dotenv =require('dotenv');
const validator = require("validator");
const isEmpty = require('../validations/isEmpty');
dotenv.config();



exports.login = async function(req,res){

    try{
        
        let email = req.body.email;
        console.log("email: ",email);
        let password = req.body.password;
        console.log("password: ",password);

        async function ValidateLogin(data) {
            let errors = {};

            data.email = !isEmpty(data.email) ? data.email : "";
            data.password = !isEmpty(data.password) ? data.password : "";
            console.log(data.email)

            if (validator.isEmpty(data.email)) {
                errors.email_empty = "Email is required";
            }

            if(!validator.isEmail(data.email)) {
                errors.email = "Email is Invalid";
            }

            if (validator.isEmpty(data.password)) {
                errors.password_empty = "password is required";
            }

            return {
                userValid: isEmpty(errors),
                usererrors: errors,
            };
        }

        const { userValid, usererrors } = await ValidateLogin(req.body);

        console.log("userValid: ",userValid);
        console.log("usererrors: ",usererrors);

        if (!userValid) {
            let response = error_function({
                statusCode: 400,
                message: "validation error",
                errors: usererrors,
            });
            res.status(response.statusCode).send(response);
            return;
        } else {
            if (email && password){

            console.log("reached here..");
            let user = await users.findOne({
                email: email
            });

            console.log("user: ",user);

            if(!user){
                let response = error_function({"statusCode" :400,"message" : "Invalid email"});
                res.status(response.statusCode).send(response);
                return;
            }

            if(user){

                let db_password=user.password;
                console.log("db_password: ",db_password);

                bcrypt.compare(password,db_password,(err,auth)=>{
                    if(auth === true) {
                        let access_token = jwt.sign({user_id :user._id}, process.env.PRIVATE_KEY,{expiresIn: "1d"});
                        console.log("access_token: ",access_token);
                            
                           
                         let response = success_function({
                            statusCode:200,
                            data:access_token,
                            message: "Login successful"
                        });
                    
                        res.status(response.statusCode).send(response);
                        return;
                    } else{
                        let response = error_function({
                            statusCode:401,
                            message: "invalid credentials"
                        });
                        res.status(response.statusCode).send(response);
                        return;
                    }
                });
            }else{
                let response = error_function({
                    statusCode:401,
                    message: "invalid credentials"
                });
                res.status(response.statusCode).send(response);
                return;
            }

        }else{
            if(!email){
                let response=error_function({
                    statusCode:422,
                    message: "email is required"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            if(!password){
                let response=success_function({
                    statusCode:422,
                    message: "password required"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }
    }
    } catch(error) {
        console.log("Node_env : ",process.env.NODE_ENV);
        if (process.env.NODE_ENV == "production") {
            let response = error_function({
                statusCode:400,
                message: error
                    ? error.message
                        ? error.message
                        : error
                :"something went wrong",        
            });
            res.status(response.statusCode).send(response);
            return;
        }else{
            let response=error_function({statusCode:400,message:error});
            res.status(response.statusCode).send(response);
            return;
        }
    }
};