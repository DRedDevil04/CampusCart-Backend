const User = require("../models/user.models.js");
const jwt = require("jsonwebtoken");
const {
    response_400,
    response_500,
} = require("../utils/responseCodes.utils.js");

async function isAuthorized(req, res, next) {
    const authToken = req.body.token || req.headers.authorization;
    console.log(req.headers);
    console.log(authToken);
    if (!authToken) {
        return response_400(res, "No token provided");
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_KEY);

        const user = await User.findById(decoded._id);

        if (!user) {
            return response_400(res, "User not found");
        }

        req.body.user = user;
        next();
    } catch (err) {
        return response_500(res, "Failed to authenticate user", err);
    }
}

function isAdmin(req, res, next) {
    const user = req.body.user;

    if (user.role !== 'admin') {
        return response_400(res, "Access denied. Admins only.");
    }

    next();
}

module.exports = {
    isAuthorized,
    isAdmin
};
