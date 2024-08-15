const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const MAX_RETRIES = parseInt(process.env.MAX_RETRIES) || 3;

const primaryTransporter = nodemailer.createTransport({
  service: process.env.PRIMARY_EMAIL_SERVICE,
  secure: true,
  port: 465,
  auth: {
    user: process.env.PRIMARY_EMAIL_USER,
    pass: process.env.PRIMARY_EMAIL_PASS,
  },
});

const backupTransporter = nodemailer.createTransport({
  service: process.env.BACKUP_EMAIL_SERVICE,
  secure: true,
  port: 465,
  auth: {
    user: process.env.BACKUP_EMAIL_USER,
    pass: process.env.BACKUP_EMAIL_PASS,
  },
});


const sendEmail = async (to, subject, text, attempt = 1) => {
  try {
    console.log(
      `Attempt ${attempt}: Sending email to ${to} via primary provider...`
    );
    const info = await primaryTransporter.sendMail({
      from: process.env.PRIMARY_EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully via primary provider.");
    return info;
  } catch (error) {
    console.error(
      `Primary provider failed on attempt ${attempt}:`,
      // error.message
    );

    if (attempt < MAX_RETRIES) {
      // Retry sending email with the primary transporter
      return await sendEmail(to, subject, text, attempt + 1);
    } else {
      console.log("Switching to backup email provider...");
      try {
        const backupInfo = await backupTransporter.sendMail({
          from: process.env.BACKUP_EMAIL_USER,
          to,
          subject,
          text,
        });
        console.log("Email sent successfully via backup provider.");
        return backupInfo;
      } catch (backupError) {
        console.error(
          "Failed to send email via backup provider:",
          // backupError.message
        );
        throw backupError;
      }
    }
  }
};

module.exports = sendEmail;
