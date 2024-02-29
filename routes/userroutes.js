const express= require('express');
const router=express.Router();
const userController=require("../controllers/userController");
const checkLogin=require('../utils/checklogin').checkLogin;

router.post('/adduser',userController.adduser);
router.get('/getuser',userController.getuser);

module.exports=router;