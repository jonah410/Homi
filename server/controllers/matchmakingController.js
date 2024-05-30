const { matchUsers } = require('../services/matchmakingService');

const startMatchmaking = async (req, res) => {
  const { userId, location } = req.body;
  try {
    const groupChat = await matchUsers(userId, location);
    if (groupChat) {
      res.status(200).json({ success: true, message: "Matchmaking started successfully", groupChat });
    } else {
      // Even if no suitable matches found, still set "looking" to true
      await updateDoc(doc(db, 'users', userId), { looking: true });
      res.status(200).json({ success: false, message: "We haven't found any suitable matches for you. But we're looking!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startMatchmaking,
};


module.exports = {
  startMatchmaking,
};


