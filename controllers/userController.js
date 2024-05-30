const User = require('../models/userModel');

exports.registerForm = (req, res) => {
  const userData = {
    username: '',
    email: '',
    phone_number: ''
  };  
  res.render('register',{status:0, userData:userData});
};

exports.loginForm = (req, res) => {
  const formData = {
    username: ''
  };  
  res.render('login',{status:0, formData:formData});
};

exports.registerUser = (req, res) => {
  const userData = {
    username: req.body.username,
    email: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password
  };

  User.create(userData, (err, result) => {
    if (err) {
      res.render('register',{status:1, userData:userData,error:err});
    }
    else {
      res.render('register',{status:2, userData:userData});
    }
  });
};
