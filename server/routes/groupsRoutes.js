const express = require('express');
const { getUserGroups, createGroupChat, getGroupById } = require('../controllers/groupController');
const router = express.Router();

// Route to test if group routes are working
router.get('/', (req, res) => {
    res.send('Group routes are working!');
});

// Route to get all groups for a user
router.get('/:userId', getUserGroups);

// Route to create a new group
router.post('/', createGroupChat);

// Route to get a specific group by ID
router.get('/group/:groupId', getGroupById);

module.exports = router;

