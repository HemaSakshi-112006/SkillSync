const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
const loginUser = async (req, res) => {
     const { email, password } = req.body;
      console.log("Login Request:", req.body);
     const user = await User.findOne({ email });
     if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}
   console.log(user);
   const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
);
console.log(isPasswordCorrect);
if (!isPasswordCorrect) {
    return res.status(401).json({
        message: "Invalid Password"
    });
}
const token = jwt.sign(
    {
        userId: user._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);
console.log(token);
  res.json({
    message: "Login Successful",
    token
});
};
module.exports = {
    registerUser,
    loginUser
};