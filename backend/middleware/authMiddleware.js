const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log(authHeader);

    res.send("Middleware Working");

};

module.exports = authMiddleware;