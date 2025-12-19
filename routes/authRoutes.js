const express = require("express");
const { registerUser, login } = require("../controllers/authController"); // <-- use 'login'

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Unified login (admin + user)
router.post("/login", login);

module.exports = {router};
