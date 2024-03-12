const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController');
const accesscontrol=require("../utils/accesscontrol").accesscontrol;

const setAccessControl = (access_type)=>{
    return(req,res,next)=> {
        accesscontrol(access_type,req,res,next);
    }
};


router.post('/login',setAccessControl('*'),authController.login);

module.exports = router;