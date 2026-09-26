const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const healthRoutes = require('./routes/health.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB();

// API Routes
app.use('/api', healthRoutes);

// Server Listening
app.listen(PORT, () => {
  console.log(`🚀 FailureLog Server running on http://localhost:${PORT}`);
});
