require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupsRoutes');
const taskRoutes = require('./routes/tasksRoutes');
const matchmakingRoutes = require('./routes/matchmakingRoutes');
const { getEmbedding } = require('./lib/openAIEmbeddings');
const { getUserGroups } = require('./controllers/groupController');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3001',  // default for development
  'https://homi-p50f.onrender.com',
  process.env.CORS_ORIGIN  // environment variable for production
].filter(Boolean);  // filter out any undefined or falsy values

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.get('/api/groups/:userId', getUserGroups);
app.use('/api/groups', groupRoutes);

app.post('/api/blitz/get-embeddings', async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) {
            return res.status(400).send('Text is required');
        }
        const embeddings = await getEmbedding(text); // Ensure this function is correctly implemented
        res.json({ embeddings });
    } catch (error) {
        console.error('Failed to get embeddings:', error.message);
        res.status(500).send(error.message);
    }
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;


