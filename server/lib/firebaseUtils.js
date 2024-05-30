const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json'); // Adjust this path as necessary

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blitz-74dc8.firebaseio.com" // Replace with your Firebase database URL
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };



