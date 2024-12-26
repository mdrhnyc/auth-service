const nodemailer = require('nodemailer');

let transporter;

function createTransporter() {
    //console.log(process.env.GMAIL_USER);
    //console.log(process.env.GMAIL_PASSWORD);
    // Check if the transporter is already created; if not, create it
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
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
