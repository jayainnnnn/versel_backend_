const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

exports.sendSMS = async () => {
  const data = qs.stringify({
    To: '+91895992993',
    From: '+1 404 476 6478',
    Body: 'Good Morning from here uth jaao!',
  });

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      data,
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    console.log('✅ SMS Sent:', response.data.sid);
  } catch (error) {
    console.error('❌ SMS Error:', error.response.data);
  }
};