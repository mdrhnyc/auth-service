const sgMail = require('@sendgrid/mail');
require('dotenv').config();  // Make sure your environment variables are loaded

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send email function
const sendMail = async (to, subject, text) => {
  const msg = {
    to: to, // Recipient's email
    from: process.env.SENDGRID_FROM_EMAIL_ADDRESS, // Replace with your verified SendGrid email
    subject: subject,
    text: text,  // Email content (plain text)
  };

  try {
    // Send the email via SendGrid
    const response = await sgMail.send(msg);
    console.log('Email sent successfully', response);
    return response;
  } catch (error) {
    console.error('Error sending email', error);
    throw error;
  }
};

module.exports = sendMail;
