// activateSandbox.js
require('dotenv').config();           // only if you’re using a .env file

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACa418bf3ed4a3b7f324a44b1fab7a0b12';
const authToken  = process.env.TWILIO_AUTH_TOKEN  || 'YOUR_AUTH_TOKEN';
const client     = require('twilio')(accountSid, authToken);

// Replace with the Sandbox phone number (your own) in E.164 format,
// and include the "whatsapp:" prefix if you want to test WhatsApp.
const handsetNumber = process.env.HANDSET_NUMBER || '+523111636236';

client.messages
  .create({
    to: handsetNumber,
    from: 'whatsapp:+14155238886',    // Your Sandbox number
    body: `join ${process.env.SANDBOX_KEYWORD || 'butter-welcome'}`
  })
  .then(message => console.log('Opt-in message SID:', message.sid))
  .catch(err     => console.error('Error activating sandbox:', err.message));
