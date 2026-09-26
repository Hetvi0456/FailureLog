const { isConnected } = require('../config/db');

const getHealthStatus = (req, res) => {
  const dbStatus = isConnected() ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

module.exports = { getHealthStatus };
