const cors = require("cors");
const express = require("express");
const User = require("./users-roles-model");
const { restricted } = require("../auth/auth-middleware");

const router = express.Router();

// Get all users with their roles
router.get("/", restricted, async (req, res) => {
    try {
        const result = await User.findAll();
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "No users found." });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve users: ${err.message}`,
        });
    }
});

// Get all roles
router.get("/roles", async (req, res) => {
    try {
        const result = await User.findAllRoles();
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "No roles found." });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve roles: ${err.message}`,
        });
    }
});

// Get a user by ID with their roles
router.get("/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const result = await User.findById(userId);
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve user: ${err.message}`,
        });
    }
});

// Get users by role id
router.get("/roles/:id", async (req, res) => {
    const roleId = parseInt(req.params.id, 10);
    if (isNaN(roleId)) {
        return res.status(400).json({ message: "Invalid role ID" });
    }

    try {
        const result = await User.findUsersByRoleId(roleId);
        if (!result.rows || result.rows.length === 0) {
            return res
                .status(404)
                .json({ message: `No users found for role: ${roleId}` });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve users by role id: ${err.message}`,
        });
    }
});

// Assign a role to a user
router.put("/:userId/assign-role", async (req, res) => {
    const { userId, roleId } = req.body;

    // Validate inputs
    if (!roleId) {
        return res.status(400).json({ message: "User ID and Role ID are required" });
    }

    try {
        // Log userId and roleId for debugging
        // console.log("User ID:", userId);
        console.log("Role ID:", roleId);

        // Check if the user exists in the users table
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the role exists in the roles table
        const roleExists = await User.findRoleById(roleId);  // Fixed here: just pass roleId
        if (!roleExists) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Assign the role to the user
        const assignedRole = await User.assignRoleToUser(userId, roleId);
        res.status(201).json({
            message: "Role assigned successfully",
            assignedRole,
        });
    } catch (error) {
        console.error("Error assigning role:", error);
        res.status(500).json({
            message: `Failed to assign role: ${error.message}`,
        });
    }
});






// Remove a role from a user
router.put("/:userId/remove-role", async (req, res) => {
    const { userId } = req.params;
    const { role_name } = req.body;

    // Validate the input
    if (!role_name) {
        return res.status(400).json({ message: "Role name is required" });
    }

    try {
        // Call the model function to remove the role
        const result = await User.removeRoleFromUser(userId, role_name);

        // Respond with the result
        res.status(200).json({
            message: `Role ${role_name} removed successfully from user ${userId}`,
            roleAssignment: result,
        });
    } catch (err) {
        // Handle errors (e.g., role not found, etc.)
        console.error(err);
        res.status(500).json({
            message: `Failed to remove role: ${err.message}`,
        });
    }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
    try {
        const result = await User.deleteUser(req.params.id);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete user: ${err.message}`,
        });
    }
});

module.exports = router;
