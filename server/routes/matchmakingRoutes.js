const express = require('express');
const router = express.Router();
const matchmakingController = require('../controllers/matchmakingController');

// Define your routes
router.post('/start', matchmakingController.startMatchmaking);

module.exports = router;





