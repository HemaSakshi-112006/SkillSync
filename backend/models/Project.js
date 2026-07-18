const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mode: {
            type: String,
            enum: ["solo", "team"],
            default: "solo"
        },

        status: {
            type: String,
            enum: ["planning", "in-progress", "completed"],
            default: "planning"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Project", projectSchema);