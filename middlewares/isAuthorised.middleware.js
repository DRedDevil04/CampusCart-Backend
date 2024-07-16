const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");

async function isAuthorized(req, res, next) {
    let authToken = req.body.token || req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: "No token provided" });
    }

    if (authToken.startsWith('Bearer ')) {
        authToken = authToken.slice(7, authToken.length).trim();
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.body.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Failed to authenticate user", error: err.message });
    }
}

function isAdmin(req, res, next) {
    const user = req.body.user;

    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
}

module.exports = {
    isAuthorized,
    isAdmin
};
