const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const updateOnboarding = async (req, res) => {
    try {
        // Get the logged-in user's ID from JWT middleware
        const userId = req.user.userId;
        
        let profileImageUrl = null;

if (req.files && req.files.profileImage) {
    const file = req.files.profileImage[0];

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "skillsync/profile-images",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        stream.end(file.buffer);
    });

    profileImageUrl = result.secure_url;
}

        // Update the user's profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        // User doesn't exist
        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Onboarding data saved successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Onboarding update error:", error);

        res.status(500).json({
            message: "Failed to save onboarding data",
            error: error.message
        });
    }
};

module.exports = {
    updateOnboarding
};