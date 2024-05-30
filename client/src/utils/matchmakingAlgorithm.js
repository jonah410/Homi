/* DEFUNCT: const User = require('../models/User');

const findMatches = async (currentUserEmbeddings) => {
    const allUsers = await User.find({}).select('embeddings');  // Fetch embeddings for all users
    return allUsers.filter(otherUser =>
        cosineSimilarity(currentUserEmbeddings, otherUser.embeddings) > threshold);
};

const cosineSimilarity = (vecA, vecB) => {
    const dotProduct = vecA.reduce((acc, curr, idx) => acc + (curr * vecB[idx]), 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, curr) => acc + (curr * curr), 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, curr) => acc + (curr * curr), 0));
    return dotProduct / (magnitudeA * magnitudeB);
};*/


