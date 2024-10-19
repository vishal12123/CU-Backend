const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

// Route for creating a new job (Protected route)
router.post("/post", authMiddleware, jobController.createJob);

module.exports = router;
