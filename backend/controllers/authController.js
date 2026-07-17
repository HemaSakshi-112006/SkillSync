const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = await User.create({
    fullName,
    username,
    email,
    password: hashedPassword
});
console.log(hashedPassword);
    console.log("requestBody:", req.body);
    
    res.status(201).json({
    message: "User registered successfully",
    user: newUser
});
};
module.exports = {
    registerUser
};