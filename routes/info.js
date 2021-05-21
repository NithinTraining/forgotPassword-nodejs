const express = require('express')
const router = express.Router();
const userController = require("../controller/info");
const {checkToken} = require('../middlewares/middleware');
//const {render}=require("ejs")




router.post('/sign-up', userController.signUp);

router.post('/login',userController.login)


router.get('/profile', checkToken, userController.getProfile)



  router.post('/forgot-password',userController.pforgot)
  router.post('/reset-password', userController.pReset)
 router.get('/set-password', userController.setPassword)
  



// router.post()
module.exports = router;
