const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createProject,
    getMyProjects,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// Get My Projects
router.get("/", authMiddleware, getMyProjects);


router.post("/", authMiddleware, createProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;