const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.registerForm);
router.post('/register', userController.registerUser);

router.get('/login', userController.loginForm);
//router.post('/login', userController.loginUser);

module.exports = router;
