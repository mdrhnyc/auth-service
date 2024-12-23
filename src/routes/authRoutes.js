const express = require("express");
const { register, login, resetPassword, profile } = require("../controllers/authController");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get('/profile', profile);


module.exports = router;
