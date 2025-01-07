const express = require("express");
const { register, login, emailVerification, verifyEmail, resetPassword, forgotPassword, profile, deleteProfile } = require("../controllers/authController");
const authenticate = require('../middlewares/authMiddleware');

const router = express.Router();
router.post("/register", register);
router.post("/send-verification-email", emailVerification);
router.get('/verify-email/:token', verifyEmail);
router.post("/login", login);
router.post("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get('/profile', authenticate, profile);
router.delete('/profile', authenticate, deleteProfile);


module.exports = router;
