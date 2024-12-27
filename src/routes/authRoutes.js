const express = require("express");
const { register, login, emailVerification, verifyEmail, resetPassword, forgotPassword, profile } = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/send-verification-email", emailVerification);
router.get('/verify-email/:token', verifyEmail);
router.post("/login", login);
router.post("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get('/profile', profile);


module.exports = router;
