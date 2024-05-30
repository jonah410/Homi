// server/testRoute.js
const express = require('express');
const { getTaskForGroup } = require('./lib/openAITasks');
const router = express.Router();

router.post('/test-task', async (req, res) => {
  const { interests, location } = req.body;

  try {
    const task = await getTaskForGroup(interests, location);
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
