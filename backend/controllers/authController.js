const User = require("../models/User");

const registerUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;
    const existingUser = await User.findOne({
    $or: [{ email }, { username }]
});

console.log("existingUser:", existingUser);

if (existingUser) {
    return res.status(400).json({
        message: "User already exists"
    });
}

    console.log("requestBody:", req.body);

    res.send("Data Received");
};

module.exports = {
    registerUser
};