const nodemailer = require('nodemailer');
var smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: 'nithinpj333@gmail.com',
      pass: '9495691023'
  }
};
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD:"password123",
  DB: "FP",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  /* transport :nodemailer.createTransport({
    host: 'localhost',
    port: 465,
    secure: true,
    auth: {
       user: 'nithinpj333@gmail.com',
       pass: '949569102329'
    }
})*/

transport : nodemailer.createTransport(smtpConfig)

  
};
