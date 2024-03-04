const express= require('express');
const router=express.Router();
const userController=require("../controllers/userController");
const checkLogin=require('../utils/checklogin').checkLogin;

router.post('/adduser',userController.adduser);//add
router.get('/getuser',userController.getuser);//get
router.get('/:userId',userController.router)

module.exports=router;