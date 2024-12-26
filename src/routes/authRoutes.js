const express = require("express");
const { register, login, resetPassword, forgotPassword, profile } = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password/:token", resetPassword);
router.post("/forgot-password", forgotPassword);
router.get('/profile', profile);


module.exports = router;
