const jwt = require("jsonwebtoken");

// AUTHENTICATION MIDDLEWARE
const restricted = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("No token found in headers");
        return res.status(401).json({ message: "Token required" });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT Verification Error:", err);
            return res.status(401).json({ message: "Token invalid" });
        }

        console.log("Decoded Token:", decoded); // Log the decoded token

        if (!decoded || !decoded.role_name) {
            console.log("Decoded token missing role_name:", decoded);
            return res.status(403).json({ message: "Invalid token structure" });
        }

        req.user = decoded;
        next();
    });
};

// AUTHORIZATION MIDDLEWARE
const checkRole = (role) => (req, res, next) => {
    if (req.decodedToken.role === role) {
        next();
    } else {
        res.status(403).json({ message: "You are not authorized!" });
    }
    // return (req, res, next) => {
    //     if (req.session.user && req.session.user.role === role) {
    //         next();
    //     } else {
    //         res.status(403).json({ message: "You are not authorized!" });
    //     }
    // };
};

module.exports = {
    restricted,
    checkRole,
};
