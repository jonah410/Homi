/* NOT NECESSARY WHEN USING FIREBASE const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  embeddings: [Number], // Adjust according to your schema
  location: {
    latitude: Number,
    longitude: Number
  },
  // Add other fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;*/
