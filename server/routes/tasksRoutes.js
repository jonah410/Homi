// server/routes/tasks.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Task routes are working!');
});

module.exports = router;