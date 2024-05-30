const { getMessaging } = require('firebase-admin/messaging');
const { admin, db } = require('../lib/firebaseUtils');
const twilio = require('twilio');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { createGroupChat } = require('../controllers/groupController')
const { updateDoc, doc } = require('firebase/firestore');


const SIMILARITY_THRESHOLD = 0.1; // WE"D PROBABLY WANT .7ish
const DISTANCE_THRESHOLD = 10; // Distance in kilometers

/* const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});*/

/*const sendNotification = async (user) => {
  try {
    // Send text message
    await twilioClient.messages.create({
      body: 'A match has been found! Check the app for more details.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: user.phoneNumber,
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Still down to link up?',
      text: 'Your group has been found! Check the app for more details.',
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};*/

/*const startMatchmaking = async (req, res) => {
  const { userId, location } = req.body;
  try {
    const groupChat = await matchUsers(userId, location);
    if (groupChat) {
      res.status(200).json({ message: "Matchmaking started successfully", groupChat });
    } else {
      res.status(404).json({ message: "No suitable matches found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getAgeRange = (age) => {
  if (age <= 14) return 'Too Young'
  if (age >= 15 && age <= 17) return '15-17';
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 34) return '25-34';
  if (age >= 35 && age <= 44) return '35-44';
  if (age >= 45 && age <= 54) return '45-54';
  if (age >= 55 && age <= 64) return '55-64';
  if (age >= 65) return '65+';
  return null;
};

// Function to calculate cosine similarity
const calculateCosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((acc, curr, idx) => acc + (curr * vecB[idx]), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, curr) => acc + (curr * curr), 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, curr) => acc + (curr * curr), 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Function to calculate distance using the Haversine formula
const calculateDistance = (locA, locB) => {
  console.log("Calculating distance between", locA, locB);

  // Check if locA and locB are objects or maps and access properties accordingly
  const latA = locA instanceof Map ? locA.get('latitude') : locA.latitude;
  const lonA = locA instanceof Map ? locA.get('longitude') : locA.longitude;
  const latB = locB instanceof Map ? locB.get('latitude') : locB.latitude;
  const lonB = locB instanceof Map ? locB.get('longitude') : locB.longitude;

  // Log the accessed values for debugging
  console.log("Latitudes and Longitudes:", latA, lonA, latB, lonB);

  if (typeof latA !== 'number' || typeof lonA !== 'number' || typeof latB !== 'number' || typeof lonB !== 'number') {
    return NaN;
  }

  const toRadians = degrees => degrees * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latA)) * Math.cos(toRadians(latB)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};


const sendNotification = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }, 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'We found you a group!',
      text: 'A new group chat has been created for you on Homi. Visit the site to check it out!',
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send notification to ${user.email}:`, error);
  }
};

// In your matchmaking function
const matchUsers = async (userId, location) => {
  try {
    const usersSnapshot = await db.collection('users').where('looking', '==', true).get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const user = users.find(u => u.id === userId);

    if (!user || !user.embeddings || typeof user.embeddings !== 'object') {
      console.error(`User ${userId} does not have valid embeddings`);
      return null;
    }

    const userAge = calculateAge(user.dob);
    const userAgeRange = getAgeRange(userAge);

    if (userAgeRange === 'Too Young') {
      console.log(`User ${userId} is too young for matchmaking`);
      return null;
    }

    const matchedUsers = users.filter(otherUser => {
      if (otherUser.id === userId) return false;
      if (!otherUser.embeddings || typeof otherUser.embeddings !== 'object') return false;

      const otherUserAge = calculateAge(otherUser.dob);
      const otherUserAgeRange = getAgeRange(otherUserAge);

      if (otherUserAgeRange !== userAgeRange) return false;

      const similarities = Object.keys(user.embeddings).map(interest => {
        if (!otherUser.embeddings[interest]) return 0; // Handle missing embeddings for specific interests
        return calculateCosineSimilarity(user.embeddings[interest], otherUser.embeddings[interest]);
      });

      const averageSimilarity = similarities.reduce((acc, val) => acc + val, 0) / similarities.length;
      const distance = calculateDistance(user.location, otherUser.location);

      console.log(`User ${userId} - ${otherUser.id}: Similarity ${averageSimilarity}, Distance ${distance}`);

      return averageSimilarity > SIMILARITY_THRESHOLD && distance <= DISTANCE_THRESHOLD;
    });

    if (matchedUsers.length >= 2 && matchedUsers.length <= 4) {
      const interests = [...user.interests, ...matchedUsers.flatMap(u => u.interests)];
      const groupChat = await createGroupChat([userId, ...matchedUsers.map(u => u.id)], interests, location);

      // Set "looking" to false
      await db.collection('users').doc(userId).update({ looking: false });
      await Promise.all(matchedUsers.map(u => db.collection('users').doc(u.id).update({ looking: false })));

      await sendNotification(user);
      await Promise.all(matchedUsers.map(u => sendNotification(u)));

      return groupChat;
    } else {
      console.log(`No suitable matches found for user ${userId}`);
      return null; // No suitable matches found
    }
  } catch (error) {
    console.error("Error in matchmaking:", error);
    throw error;
  }
};

module.exports = {
  matchUsers,
  /* startMatchmaking,*/
};

