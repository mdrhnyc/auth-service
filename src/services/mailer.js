const nodemailer = require('nodemailer');

let transporter;

function createTransporter() {
    // Check if the transporter is already created; if not, create it
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',  // Use Gmail service for sending emails
            auth: {
                user: process.env.GMAIL_USER,     // Your Gmail email address (set in .env)
                pass: process.env.GMAIL_PASSWORD, // Your Gmail app password (set in .env)
            },
        });
    }

    // Return the existing transporter instance
    return transporter;
}

module.exports = createTransporter;
