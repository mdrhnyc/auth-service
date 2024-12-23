const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

// Login Function
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

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
            email: user.email
        });

    } catch (error) {
        console.log(error);
        // Handle error (e.g., invalid or expired token)
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
