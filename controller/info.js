const db = require("../models");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const c=require("../config/db.config")
const crypto=require("crypto")
const fs = require('fs')
const ejs = require('ejs')




const User=db.user;
const ResetTokens=db.ResetTokens;


module.exports = {
  signUp: async (req, res) => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(req.body.password, salt);
      const users = {
        name: req.body.name,
        email: req.body.email,
        password: hash
      };

      const result = await User.create(users);

      return res.status(200).json({
        success: true,
        message: "user created Successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
  login: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        res.status(401).json({
          message: "No User Found",
        });
      } else {
        bcryptjs.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                user_id: user.id,
              },
              "secret"
            );
            res.status(200).json({
              success: true,
              message: "authentication successfull",
              token: token,
            });
          } else {
            res.status(401).json({
              success: false,
              message: "invalid credentials",
            });
          }
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
 
  getProfile: async (req, res) => {
    try{
    
    

      return res.status(200).json({
        success: true,
        message: "get user profile successfully",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  
},


pforgot: async (req, res, next)=> {
  //ensure that you have a user with this email
  var email = await User.findOne({where: { email: req.body.email }});
  if (email == null) {
  
    return res.json({status: 'ok'});
  }
  /**
   * Expire any tokens that were previously
   * set for this user. That prevents old tokens
   * from being used.
   **/
  await ResetTokens.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
  //Create a random reset token
  var fpSalt = crypto.randomBytes(64).toString('base64');
 
  //token expires after one hour
  var expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1/24);
 
  //insert token data into DB
  await ResetTokens.create({
    email: req.body.email,
    expiration: expireDate,
    token: fpSalt,
    used: 0
  });

  //create email link
  const html = await ejs.renderFile('template/forgot_mail.ejs', {
    link: `http://localhost:3000/set-password?token=${fpSalt}` //link of the page where you have a form to enter new password
  })

  //create email
  const message = {
      from: 'nithinpj333@gmail.com',
      to: req.body.email,
      replyTo: 'nithinpj333@mailinator.com',
      subject: 'FORGOT_PASS_SUBJECT_LINE',
      html:html
  };
 
  //send email
  c.transport.sendMail(message, function (err, info) {
     if(err) { console.log(err)}
     else { console.log(info); }
  });
 
  return res.json({status: 'ok da'});
},



//router.get('/reset-password', 
/*gReset:async (req, res, next)=> {
  
   //This code clears all expired tokens. 
   
  await ResetToken.destroy({
    where: {
      expiration: { [Op.lt]: Sequelize.fn('CURDATE')},
    }
  });
 
  //find the token
  var record = await ResetToken.findOne({
    where: {
      email: req.query.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
      token: req.query.token,
      used: 0
    }
  });
 
  if (record == null) {
    return res.render('user/reset-password', {
      message: 'Token has expired. Please try password reset again.',
      showForm: false
    });
  }
 
  res.render('user/reset-password', {
    showForm: true,
    record: record
  });
},*/





//router.post('/reset-password', 
pReset:async function(req, res, next) {
  //compare passwords
  if (req.body.password1 !== req.body.password2) {
    return res.json({status: 'error', message: 'Passwords do not match. Please try again.'});
  }
 
  /**
  * Ensure password is valid (isValidPassword
  * function checks if password is >= 8 chars, alphanumeric,
  * has special chars, etc)
  **/
  if (!isValidPassword(req.body.password1)) {
    return res.json({status: 'error', message: 'Password does not meet minimum requirements. Please try again.'});
  }
 
  var record = await ResetToken.findOne({
    where: {
      email: req.body.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
      token: req.body.token,
      used: 0
    }
  });
 
  if (record == null) {
    return res.json({status: 'error', message: 'Token not found. Please try the reset password process again.'});
  }
 
  var upd = await ResetToken.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
  var newSalt = crypto.randomBytes(64).toString('hex');
  var newPassword = crypto.pbkdf2Sync(req.body.password1, newSalt, 10000, 64, 'sha512').toString('base64');
 
  await User.update({
    password: newPassword,
    salt: newSalt
  },
  {
    where: {
      email: req.body.email
    }
  });
 
  return res.json({status: 'ok', message: 'Password reset. Please login with your new password.'});
},


setPassword: async (req, res) => {
  res.render('setPasword')
}

  };

