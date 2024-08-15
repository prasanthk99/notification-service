const express = require('express');
const notificationController = require('./notification.controller');

const router = express.Router();

router.use('/', notificationController);

module.exports = router;