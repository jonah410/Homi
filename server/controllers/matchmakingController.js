const { matchUsers } = require('../services/matchmakingService');
const { db } = require('../lib/firebaseUtils'); // Ensure this is the correct import for Firestore

const startMatchmaking = async (req, res) => {
  const { userId, location } = req.body;
  console.log('Starting matchmaking for user:', userId);
  try {
    const groupChat = await matchUsers(userId, location);
    console.log('Group chat result:', groupChat);
    if (groupChat) {
      console.log('Matchmaking started successfully for user:', userId);
      res.status(200).json({ success: true, message: "Matchmaking started successfully", groupChat });
    } else {
      console.log('No suitable matches found, setting looking status to true for user:', userId);
      // Even if no suitable matches found, still set "looking" to true
      await db.collection('users').doc(userId).update({
        looking: true,
        location: location,
      });
      res.status(200).json({ success: false, message: "We haven't found any suitable matches for you yet. But we're looking!" });
    }
  } catch (error) {
    console.error('Error in /api/matchmaking/start:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  startMatchmaking,
};



