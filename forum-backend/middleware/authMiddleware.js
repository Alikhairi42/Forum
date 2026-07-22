const jwt = require("jsonwebtoken");

const check_token = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(402).json({ message: "Access denied. No token provided." });
    }
    try {
        const cleantoken = token.replace("Bearer ", "");
        const verified = jwt.verify(cleantoken, process.env.JWT_SECRET);

        req.user = verified;

        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token." });
    }
};
module.exports = check_token;