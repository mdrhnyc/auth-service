const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

console.log("JWT_SECRET is:", process.env.JWT_SECRET);
console.log("PORT is:", process.env.PORT);

const app = express();
app.use(express.json());

// Authentication Routes
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
