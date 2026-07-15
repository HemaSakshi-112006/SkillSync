const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// Home Route
app.get("/", (req, res) => {
  res.send("SkillSync Backend Running");
});

// Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
  });
};

startServer();