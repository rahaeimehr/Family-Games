const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.registerForm);
router.post('/register', userController.registerUser);

router.get('/profile', userController.profileForm);

router.get('/login', userController.loginForm);
router.post('/login', userController.loginUser);



router.get('/logout', userController.logoutUser);

module.exports = router;
