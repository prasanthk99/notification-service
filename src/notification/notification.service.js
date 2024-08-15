const sendEmail = require("../channels/email/email.service");

class NotificationService {
  async sendNotification(to, subject, text) {
    console.log('Starting notification process...');
    await sendEmail(to, subject, text);
  }
}

module.exports = new NotificationService();
