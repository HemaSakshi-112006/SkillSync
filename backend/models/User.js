const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Authentication
    // ==========================
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ==========================
    // Academic Information
    // ==========================
    college: {
      type: String,
      default: "",
      trim: true,
    },

    branch: {
      type: String,
      default: "",
      trim: true,
    },

    semester: {
      type: Number,
      default: null,
    },

    section: {
      type: String,
      default: "",
      trim: true,
    },

    usn: {
      type: String,
      default: "",
      trim: true,
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    // ==========================
    // Profile
    // ==========================
    bio: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    // ==========================
    // Social Links
    // ==========================
    github: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    portfolio: {
      type: String,
      default: "",
      trim: true,
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);