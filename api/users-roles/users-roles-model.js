const db = require("../../config/db");

const findAll = async () => {
    return db.query(
        `SELECT users.id, users.username, users.email, 
        ARRAY_AGG(roles.role_name) AS roles 
        FROM users 
        LEFT JOIN user_roles ON users.id = user_roles.user_id 
        LEFT JOIN roles ON user_roles.role_id = roles.id 
        GROUP BY users.id`
    );
};

const findAllRoles = async () => {
    return db.query("SELECT * FROM roles");
};

const findByUsername = async (username) => {
    return db.query(
        `SELECT users.id, users.username, users.email, users.password, 
        ARRAY_AGG(roles.role_name) AS roles 
        FROM users 
        LEFT JOIN user_roles ON users.id = user_roles.user_id 
        LEFT JOIN roles ON user_roles.role_id = roles.id 
        WHERE users.username = $1 
        GROUP BY users.id, users.password`,
        [username]
    );
};

const findById = async (id) => {
    return db.query(
        `SELECT users.id, users.username, users.email, 
        ARRAY_AGG(roles.role_name) AS roles 
        FROM users 
        LEFT JOIN user_roles ON users.id = user_roles.user_id 
        LEFT JOIN roles ON user_roles.role_id = roles.id 
        WHERE users.id = $1 
        GROUP BY users.id`,
        [id]
    );
};

const addUser = async (username, email, password, role_names = ["User"]) => {
    try {
        if (!Array.isArray(role_names)) {
            role_names = [role_names];
        }

        const userResult = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password]
        );
        const user = userResult.rows[0];

        const roleResults = await db.query(
            "SELECT id FROM roles WHERE role_name = ANY($1::text[])",
            [role_names]
        );

        const roleIds = roleResults.rows.map((r) => r.id);

        for (const roleId of roleIds) {
            await db.query(
                "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)",
                [user.id, roleId]
            );
        }

        return findById(user.id);
    } catch (error) {
        throw error;
    }
};

const findUsersByRoleId = async (role_id) => {
    return db.query(
        `SELECT users.id, users.username, users.email, roles.role_name 
        FROM users 
        JOIN user_roles ON users.id = user_roles.user_id 
        JOIN roles ON user_roles.role_id = roles.id 
        WHERE roles.id = $1`,
        [role_id]
    );
};

const findRoleById = async (roleId) => {
    try {
        const roleResult = await db.query("SELECT * FROM roles WHERE id = $1", [
            roleId,
        ]);
        return roleResult.rows[0]; // Return the role if found
    } catch (error) {
        throw new Error("Role not found");
    }
};

// find role by name
const findRoleByName = async (roleName) => {
    try {
        const roleResult = await db.query("SELECT * FROM roles WHERE role_name = $1", [
            roleName,
        ]);
        return roleResult.rows[0]; // Return the role if found
    } catch (error) {
        throw new Error("Role not found");
    }
};


const assignRoleToUser = async (userId, roleId) => {
    try {
        const result = await db.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *",
            [userId, roleId]
        );

        return result.rows[0]; // Return assigned role details
    } catch (error) {
        throw error;
    }
};


const unassignRoleFromUser = async (userId, roleId) => {
    try {
        // Check if the role exists by roleId
        const roleResult = await db.query(
            "SELECT id FROM roles WHERE id = $1",
            [roleId]
        );

        if (roleResult.rows.length === 0) {
            throw new Error(`Role with ID '${roleId}' not found`);
        }

        // Check if the user has this role
        const userRoleCheck = await db.query(
            "SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2",
            [userId, roleId]
        );

        if (userRoleCheck.rows.length === 0) {
            throw new Error(`User does not have the role with ID '${roleId}'`);
        }

        // Remove the role from the user
        const deleteResult = await db.query(
            "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2",
            [userId, roleId]
        );

        if (deleteResult.rowCount === 0) {
            throw new Error(
                `Failed to remove the role with ID '${roleId}' from the user`
            );
        }

        return {
            message: `Role with ID '${roleId}' successfully removed from user ${userId}`,
        };
    } catch (error) {
        console.error("Error unassigning role:", error);
        throw error;
    }
};



// remove role from user
const removeRoleFromUser = async (userId, roleId) => {
    return db.query(
        "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2",
        [userId, roleId]
    );
};


const deleteUser = async (id) => {
    return db.query("DELETE FROM users WHERE id = $1", [id]);
};



module.exports = {
    findAll,
    findAllRoles,
    findByUsername,
    findById,
    findRoleByName,
    addUser,
    assignRoleToUser,
    findUsersByRoleId,
    findRoleById,
    unassignRoleFromUser,
    removeRoleFromUser,
    deleteUser,
};
