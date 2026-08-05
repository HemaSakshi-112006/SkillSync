const express = require("express");

const router = express.Router();

const { updateOnboarding } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Update logged-in user's onboarding/profile data
router.put(
    "/onboarding",
    authMiddleware,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "resume", maxCount: 1 }
    ]),
    updateOnboarding
);

module.exports = router;