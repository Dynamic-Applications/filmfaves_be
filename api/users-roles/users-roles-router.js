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
        
        // If there are no roles found, return 404 error
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "No roles found." });
        }
        
        // Extract rows directly and send them as the response
        const rolesArray = result.rows.map(role => role.role_name);  // If you need only the role names
        res.json(rolesArray);  // Send only the array of role names (or full objects if needed)

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

router.put("/:userId/assign-role", async (req, res) => {
    const userId = parseInt(req.params.userId, 10); // Get userId from URL
    const { roleId } = req.body; // Get roleId from the body

    // Validate inputs
    if (!roleId) {
        return res
            .status(400)
            .json({ message: "User ID and Role ID are required" });
    }

    try {
        // Log userId and roleId for debugging
        console.log("User ID:", userId);
        console.log("Role ID:", roleId);

        // Check if the user exists in the users table
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the role exists in the roles table
        const roleExists = await User.findRoleById(roleId); // Use roleId, not roleName
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


// Unassign a role from a user
router.put("/:userId/unassign-role", async (req, res) => {
    const { userId, roleName } = req.body;

    // Validate inputs
    if (!roleName) {
        return res.status(400).json({ message: "User ID and Role Name are required" });
    }

    try {
        // Attempt to unassign the role
        const result = await User.unassignRoleFromUser(userId, roleName);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error unassigning role:", error);
        res.status(500).json({
            message: `Failed to unassign role: ${error.message}`,
        });
    }
});




// // Unassign roles from a user
// router.put("/:userId/remove-roles", async (req, res) => {
//     const { userId } = req.params;
//     let { roles } = req.body;  

//     console.log("Received roles in request:", roles);
//     console.log("Received user ID in request:", userId);

//     // Ensure roles is a valid array
//     if (!Array.isArray(roles)) {
//         return res.status(400).json({ message: "Roles should be an array." });
//     }

//     // If roles array is empty, return an appropriate error
//     if (roles.length === 0) {
//         return res.status(400).json({ message: "Roles array cannot be empty." });
//     }

//     try {
        
//         const roleNames = roles.map(role => typeof role === "object" ? role.role_name : role);
//         console.log("Role names to remove:", roleNames);

//         const notFoundRoles = [];
//         for (const roleName of roleNames) {
//             try {
//                 const result = await User.removeRoleFromUser(userId, "admin");
//                 console.log("Result of removing role:", result);
//                 if (!result) {
//                     notFoundRoles.push(roleName);
//                 }
//             } catch (err) {
//                 notFoundRoles.push(roleName);
//             }
//         }

//         if (notFoundRoles.length > 0) {
//             return res.status(404).json({
//                 message: `These roles were not found or could not be removed: ${notFoundRoles.join(", ")}`,
//             });
//         }

//         res.status(200).json({ message: "Roles removed successfully from user" });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: `Failed to remove roles: ${err.message}` });
//     }
// });




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
