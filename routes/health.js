const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Also support OPTIONS requests for CORS preflight
router.options('/health', (req, res) => {
  res.status(200).send();
});

module.exports = router;
