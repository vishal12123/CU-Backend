const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register route
router.post("/register", authController.register);

router.get("/verify/:token", authController.verifyEmail);

// Login route
router.post("/login", authController.login);

// Logout route (Frontend will clear token)
router.post('/logout', authController.logout);




module.exports = router;
