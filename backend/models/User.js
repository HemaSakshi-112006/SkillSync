const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    // ==========================
    // Authentication
    // ==========================
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    // ==========================
    // Profile
    // ==========================

    profileImage: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        default: "",
        maxlength: 500,
        trim: true
    },

    gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Prefer not to say"],
    default: "Prefer not to say"
},

    dateOfBirth: {
        type: Date,
        default: null
    },

    phoneNumber: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    // ==========================
    // Academic Information
    // ==========================

    college: {
        type: String,
        default: "",
        trim: true
    },

    degree: {
        type: String,
        default: "",
        trim: true
    },

    branch: {
        type: String,
        default: "",
        trim: true
    },

    semester: {
        type: Number,
        default: null
    },

    section: {
        type: String,
        default: "",
        trim: true
    },

    usn: {
        type: String,
        default: "",
        trim: true
    },

    graduationYear: {
        type: Number,
        default: null
    },

    cgpa: {
        type: Number,
        default: null
    },

    // ==========================
    // Skills & Interests
    // ==========================

    skills: {
        type: [String],
        default: []
    },

    interests: {
        type: [String],
        default: []
    },

    preferredRoles: {
        type: [String],
        default: []
    },

    preferredDomains: {
        type: [String],
        default: []
    },

   experienceLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
},

    // ==========================
    // Career Goals
    // ==========================

    careerGoals: {
        type: [String],
        default: []
    },

    availability: {
        type: String,
        default: ""
    },

    preferredTeamSize: {
        type: Number,
        default: null
    },

    lookingForTeam: {
        type: Boolean,
        default: true
    },

    // ==========================
    // Languages
    // ==========================

    languages: {
        type: [String],
        default: []
    },

    // ==========================
    // Social Links
    // ==========================

    github: {
        type: String,
        default: "",
        trim: true
    },

    linkedin: {
        type: String,
        default: "",
        trim: true
    },

    portfolio: {
        type: String,
        default: "",
        trim: true
    },

    resume: {
        type: String,
        default: ""
    },

    // ==========================
    // AI Preferences
    // ==========================

    aiPreferences: {
        projectRecommendations: {
            type: Boolean,
            default: true
        },

        teammateRecommendations: {
            type: Boolean,
            default: true
        },

        learningRoadmap: {
            type: Boolean,
            default: true
        },

        resumeSuggestions: {
            type: Boolean,
            default: true
        }
    },

    // ==========================
    // Account Status
    // ==========================

    isProfileCompleted: {
        type: Boolean,
        default: false
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

   accountVisibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Public"
}
},
{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);