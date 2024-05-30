// server/controllers/groupController.js

const { db } = require('../lib/firebaseUtils');
const { getTaskForGroup } = require('../lib/openAITasks');

const getUserGroups = async (req, res) => {
    const userId = req.params.userId;

    try {
        const groupsSnapshot = await db.collection('groups').where('users', 'array-contains', userId).get();
        const groups = groupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).send('Failed to fetch user groups');
    }
};

// Create a new group
const createGroupChat = async (userIds, interests, location) => {
    try {
      const task = await getTaskForGroup(interests, location);
      const groupRef = await db.collection('groups').add({
        users: userIds,
        task: task,
        createdAt: new Date(),
      });
      return { id: groupRef.id, users: userIds, task: task };
    } catch (error) {
      console.error('Failed to generate task for the group:', error);
    }
};

// Get a specific group by ID
const getGroupById = async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const groupDoc = await db.collection('groups').doc(groupId).get();
        if (!groupDoc.exists) {
            return res.status(404).send('Group not found');
        }
        res.status(200).json({ id: groupDoc.id, ...groupDoc.data() });
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).send('Failed to fetch group');
    }
};

module.exports = {
    getUserGroups,
    createGroupChat,
    getGroupById
};



  