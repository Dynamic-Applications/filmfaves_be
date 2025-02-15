const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users/users-model");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password, role_name } = req.body;

    const role = role_name || "user";

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const result = await User.addUser(username, email, hashedPassword, role);
        res.status(201).json({
            message: `Welcome to FilmFaves, ${result.rows[0].username}`,
        });
    } catch (err) {
        res.status(500).json({
            message: `Failed to sign up: ${err.message}`,
        });
    }
});

router.post("/login", async (req, res, next) => {
    const authError = { message: "Invalid credentials!" };
    try {
        const result = await User.findByUsername(req.body.username);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json(authError);
        }

        const passwordValid = await bcrypt.compare(
            req.body.password,
            user.password
        );
        console.log("User logged in:", user.username);

        if (!passwordValid) {
            return res.status(401).json(authError);
        }

        const roleName =
            user.roles && user.roles.length > 0 ? user.roles[0] : "user";

        const token = buildToken(user, roleName);
        res.status(200).json({
            message: `Welcome back, ${user.username}!, You are logged in as a ${roleName}`,
            token,
        });
    } catch (err) {
        next(err);
    }
});

function buildToken(user, roleName) {
    const payload = {
        subject: user.id,
        username: user.username,
        email: user.email,
        role_name: roleName,
    };
    const options = {
        expiresIn: "1d",
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

router.get("/logout", async(req, res) => {
    const result = await User.findByUsername(req.body.username);
    const user = result.rows[0];
    console.log("User logged out:", user.username);

    // Clear the cookie
    res.clearCookie("token");

    // Add CORS headers explicitly
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Match frontend URL
    res.setHeader("Access-Control-Allow-Credentials", "true"); // If you're sending credentials like cookies

    // Respond with a success message
    res.json({ message: "You have successfully logged out." });
});



module.exports = router;
