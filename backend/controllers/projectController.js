const Project = require("../models/Project");
const createProject = async (req, res) => {
    const { title, description } = req.body;
    const project = await Project.create({
        title,
        description,
        owner: req.user.userId
    });
    res.status(201).json({
        message: "Project Created Successfully",
        project
    });
};
const getMyProjects = async (req, res) => {

    const projects = await Project.find({
        owner: req.user.userId
    });

    res.status(200).json(projects);

};
const updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, mode, status } = req.body;
    const updatedProject = await Project.findOneAndUpdate(
        {
            _id: id,
            owner: req.user.userId
        },
        {
            title,
            description,
            mode,
            status
        },
        {
            new: true
        }
    );
    if (!updatedProject) {
        return res.status(404).json({
            message: "Project Not Found"
        });
    }
    res.status(200).json({
        message: "Project Updated Successfully",
        project: updatedProject
    });
};
module.exports = {
    createProject,
    getMyProjects,
    updateProject
};