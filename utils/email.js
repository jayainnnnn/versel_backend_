const nodemailer = require('nodemailer');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const emailTemplatePath = path.join(__dirname, '../templates/loginalert.html');
const htmlContent = fs.readFileSync(emailTemplatePath, 'utf-8');


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendLoginEmail = async (to, token) => {
  console.log(`📤 Trying to send login email to ${to}`);
  const mailOptions = {
    from: `"AJ Tracker" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Verify your email',

    html: htmlContent,
  };
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.messageId);
};