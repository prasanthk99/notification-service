const express = require('express');
const notificationModule = require('./notification/notification.module');

const app = express();
app.use(express.json());

app.use('/notifications', notificationModule);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});