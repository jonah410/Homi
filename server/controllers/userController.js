// Import necessary models and utilities
const User = require('../models/User');

// Example function to register a user
exports.registerUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example function to login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Authenticate the user with Firebase Auth
      const userRecord = await admin.auth().getUserByEmail(email);
  
      // Create a custom token for the authenticated user
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
  
      // Return the custom token to the client
      res.status(200).json({
        message: "Login successful",
        token: customToken,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Function to save user embeddings
exports.saveUserEmbeddings = async (req, res) => {
  const { userId, embeddings } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      user.embeddings = embeddings;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
