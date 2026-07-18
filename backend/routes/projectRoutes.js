const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createProject,
    getMyProjects,
    updateProject
} = require("../controllers/projectController");

// Get My Projects
router.get("/", authMiddleware, getMyProjects);

// Create Project
router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);

module.exports = router;