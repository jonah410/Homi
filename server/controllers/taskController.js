const Group = require('../models/Group');
const User = require('../models/User');

// Function to check task completion and award tokens
const checkTaskCompletion = async (groupId) => {
  const group = await Group.findById(groupId);
  const task = group.currentTask;
  
  // maybe not necessary? we have this logic already in the matchmakingController
  const isSameLocation = (locA, locB) => {
    const toRadians = degrees => degrees * (Math.PI / 180);

    const lat1 = locA.latitude;
    const lon1 = locA.longitude;
    const lat2 = locB.latitude;
    const lon2 = locB.longitude;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < .5) return true // close enough to same location
    
    return false
  };

  // Verify all users are in the same location
  const allInSameLocation = group.users.every(user => isSameLocation(user.location, group.location));

  if (allInSameLocation) {
    // Award blitz tokens based on task difficulty
    const getTokensForTask = (difficulty) => {
      switch (difficulty) {
        case 'easy':
          return 10;
        case 'medium':
          return 20;
        case 'hard':
          return 30;
        default:
          return 0;
      }
    };

    const tokens = getTokensForTask(task.difficulty);
    group.users.forEach(async (userId) => {
      const user = await User.findById(userId);
      user.tokens += tokens;
      await user.save();
    });
  }
};

/*const assignTasks = async (groupChat) => {
  const groupRef = db.collection('groups').doc(groupChat.id);
  await groupRef.update({
    tasks: [
      { difficulty: 'easy', task: 'Easy Task' },
      { difficulty: 'medium', task: 'Medium Task' },
      { difficulty: 'hard', task: 'Hard Task' },
    ],
  });
};*/

// Export the function as part of your module
module.exports = {
  checkTaskCompletion,
};

  