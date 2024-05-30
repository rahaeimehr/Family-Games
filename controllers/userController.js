const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.registerForm = (req, res) => {
  const userData = {
    username: '',
    screen_name: '',
    email: '',
    phone_number: ''
  };  
  res.render('register', { status: 0, userData: userData });
};


exports.registerUser = async (req, res) => {
  const userData = {
    username: req.body.username,
    screen_name: req.body.screen_name,
    email: req.body.email,    
    phone_number: req.body.phone_number,
    password: null
  };
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    userData.password = hashedPassword;

    const result = await User.create(userData);
    res.render('register', { status: 2, userData: userData });
  } catch (err) {
    res.render('register', { status: 1, userData: userData, error: err });
  }
};




exports.loginForm = (req, res) => {
  const formData = {
    username: ''
  };  
  res.render('login', { status: 0, formData: formData });
};

exports.loginUser = async (req, res) => {
  const userData = {
    username: req.body.username
  };

  try {
    const user = await User.login(req.body.username, req.body.password);

    if (user) {
        req.session.user = {
          id: user.id,
          username: user.username,
          screen_name : user.screen_name,
          email: user.email};
        res.locals.user = user;
        res.render("index");
    } else {
      res.render('login', { status: 1, formData: userData, error: 'Invalid username or password' });
    }
  } catch (err) {
    res.render('login', { status: 1, formData: userData, error: err });
  }
};
exports.logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
}

exports.profileForm = (req, res) => {
  const formData = {
    username: ''
  };  
  res.render('profile', { status: 0, formData: formData });
};