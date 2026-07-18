const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
    res.json({
        message: "Protected Route Accessed Successfully",
        loggedInUser: req.user
    });
});

module.exports = router;