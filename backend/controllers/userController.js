const User = require("../models/User");

const updateOnboarding = async (req, res) => {
    try {
        // Get the logged-in user's ID from JWT middleware
        const userId = req.user.userId;

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