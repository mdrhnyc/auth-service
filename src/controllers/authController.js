const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendMail = require('../services/mailer');

// Register Function
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.emailVerification = async (req, res) => {
    const { email } = req.body;  // Extract email from the request body

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate a verification token (valid for 1 hour)
        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        // Store the verification token and its expiration date
        user.verificationToken = verificationToken;
        user.verificationTokenExpiration = Date.now() + 3600000;  // Token expires in 1 hour
        await user.save();
    
        // Create the verification URL
        const verificationUrl = `http://localhost:3000/auth/verify-email/${verificationToken}`;
        
        // Send the verification email
        const subject = 'Email Verification';
        const text = `Click the following link to verify your email: ${verificationUrl}`;
        await sendMail(user.email, subject, text);  // Send via SendGrid
    
        res.json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by userId
        const user = await User.findById(decoded.userId);
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Check if the token has expired
        if (user.verificationTokenExpiration < Date.now()) {
        return res.status(400).json({ message: 'Token has expired' });
        }

        // Verify the user's email
        user.emailVerified = true;
        user.verificationToken = undefined;  // Clear the verification token
        user.verificationTokenExpiration = undefined;  // Clear the expiration field
        await user.save();

        res.json({ message: 'Email successfully verified' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

// Login Function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const expiresIn = req.body.expiresIn || '1h'; 

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: expiresIn });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;  // Extract email from the request body

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a password reset token (valid for 1 hour)
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create the reset URL (with the reset token embedded in it)
        const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

        // Create the email content
        const subject = 'Password Reset Request';
        const text = `Click the following link to reset your password: ${resetUrl}`;

        // Send the reset email using the sendMail function from mailer.js (SendGrid)
        await sendMail(user.email, subject, text);  // Send email via SendGrid

        res.json({ message: 'Password reset link sent to your email' });

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: error.message });
    }
};


// Login Function
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify the JWT and get the userId
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the userId from the decoded token
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password has been successfully reset' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

exports.profile = async (req, res) => {
    // Get the JWT from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];  // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by the decoded userId (from the token)
        const user = await User.findById(decoded.userId);

        // If the user does not exist, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user profile (email, or any other fields you need)
        res.json({
            email: user.email,
            has_verified_email: user.emailVerified
        });

    } catch (error) {
        console.log(error);
        // Handle error (e.g., invalid or expired token)
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
