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
            console.error("JWT Verification Error:", err);
            return res.status(401).json({ message: "Token invalid" });
        }

        console.log("Decoded Token:", decoded);

        // Ensure the token has the required structure
        if (!decoded || !decoded.subject || !decoded.role_name) {
            console.log("Invalid token structure:", decoded);
            return res.status(403).json({ message: "Invalid token structure" });
        }

        // Attach user info and normalize role format to an array
        req.user = {
            id: decoded.subject,
            username: decoded.username,
            email: decoded.email,
            roles: Array.isArray(decoded.role_name)
                ? decoded.role_name
                : [decoded.role_name], // Convert to array if it's a string
        };

        console.log("Authenticated User:", req.user);
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
