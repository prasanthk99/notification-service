const express = require('express');
const notificationService = require('./notification.service');

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.send("Successfully connected to the Notification Service");
});

// Endpoint to send notification
router.post('/send', async (req, res) => {
  const { to, subject, text } = req.body;
  
  try {
    const info = await notificationService.sendNotification(to, subject, text);
    res.status(200).send({
      message: 'Notification sent successfully.',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Failed to send notification.',
      error: error.message
    });
  }
});

module.exports = router;
