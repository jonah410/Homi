const express = require('express');
const router = express.Router();

// Import your controller functions
const userController = require('../controllers/userController');

// Define your routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);  // Ensure this route is defined correctly
router.post('/saveEmbeddings', userController.saveUserEmbeddings);

module.exports = router;

