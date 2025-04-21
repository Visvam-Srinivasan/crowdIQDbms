const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/signup/:role', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
