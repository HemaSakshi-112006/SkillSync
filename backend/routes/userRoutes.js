const express = require("express");

const router = express.Router();

const { updateOnboarding } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Update logged-in user's onboarding/profile data
router.put("/onboarding", authMiddleware, updateOnboarding);

module.exports = router;