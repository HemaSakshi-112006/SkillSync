const express = require("express");

const router = express.Router();

const {
    updateOnboarding,
    getMyProfile,
    updateMyProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// Get logged-in user's profile
router.get(
    "/profile",
    authMiddleware,
    getMyProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateMyProfile
);


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