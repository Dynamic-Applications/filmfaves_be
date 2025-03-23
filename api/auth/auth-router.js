const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../users-roles/users-roles-model");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, email, password, role_name } = req.body;

    const role = role_name || "User";

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const result = await User.addUser(
            username,
            email,
            hashedPassword,
            role
        );
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
            user.roles && user.roles.length > 0 ? user.roles[0] : "User";

        const token = buildToken(user, roleName);
        res.status(200).json({
            message: `Welcome back, ${user.username}!, You are logged in as ${roleName}`,
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
        expiresIn: "1h",
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

router.get("/logout", async (req, res) => {
    try {
        // Log the action (optional, only if you have the username from the session or token)
        console.log("User logged out.");

        // Clear the cookie
        res.clearCookie("token");

        // Respond with a success message
        res.status(200).json({ message: "You have successfully logged out." });
    } catch (error) {
        console.error("Error during logout:", error.message);
        res.status(500).json({ message: "An error occurred during logout." });
    }
});

module.exports = router;
