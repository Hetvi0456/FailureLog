const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const failureRoutes = require('./routes/failure.routes');

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
app.use('/api/auth', authRoutes);
app.use('/api/failures', failureRoutes);

// Global Error Handler Fallback
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Server Listening
app.listen(PORT, () => {
  console.log(`🚀 FailureLog Server running on http://localhost:${PORT}`);
});
