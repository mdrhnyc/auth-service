const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next(); // Skip hashing if the password is not modified
    }
    
    try {
        // Only hash if the password is not already hashed
        const isHashed = this.password.startsWith('$2b$'); // bcrypt hashes start with "$2b$"
        if (!isHashed) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Export the User model
module.exports = mongoose.model("User", userSchema);
