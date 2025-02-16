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

const findByEmail = async (email) => {
    return db.query(
        `SELECT users.id, users.username, users.email, 
        ARRAY_AGG(roles.role_name) AS roles 
        FROM users 
        LEFT JOIN user_roles ON users.id = user_roles.user_id 
        LEFT JOIN roles ON user_roles.role_id = roles.id 
        WHERE users.email = $1 
        GROUP BY users.id`,
        [email]
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

const findByRole = async (role_name) => {
    return db.query(
        `SELECT users.id, users.username, users.email 
        FROM users 
        JOIN user_roles ON users.id = user_roles.user_id 
        JOIN roles ON user_roles.role_id = roles.id 
        WHERE roles.role_name = $1`,
        [role_name]
    );
};

const addUser = async (username, email, password, role_names = ["user"]) => {
    try {
        // Ensure role_names is always an array, even if a single role is passed as a string
        if (!Array.isArray(role_names)) {
            role_names = [role_names]; // Convert string to array if it's a single role
        }

        // Insert user into users table
        const userResult = await db.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, password]
        );
        const user = userResult.rows[0];

        // Fetch role IDs from the roles table based on role_names
        const roleResults = await db.query(
            "SELECT id FROM roles WHERE role_name = ANY($1::text[])",
            [role_names] // Now passing the roles as an array to the query
        );

        const roleIds = roleResults.rows.map((r) => r.id);

        // Insert role associations into user_roles table
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

const assignRoleToUser = async (userId, roleName) => {
    try {
        // Find the role_id corresponding to the role_name
        const roleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = $1",
            [roleName]
        );

        // Check if the role exists
        if (roleResult.rows.length === 0) {
            throw new Error("Role not found");
        }

        const roleId = roleResult.rows[0].id;

        // Insert into the user_roles table to assign the role
        const result = await db.query(
            "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *",
            [userId, roleId]
        );

        return result.rows[0]; // Return the role assignment information
    } catch (error) {
        throw error;
    }
};

const removeRoleFromUser = async (userId, roleName) => {
    try {
        // Find the role_id corresponding to the role_name
        const roleResult = await db.query(
            "SELECT id FROM roles WHERE role_name = $1",
            [roleName]
        );

        // Check if the role exists
        if (roleResult.rows.length === 0) {
            throw new Error("Role not found");
        }

        const roleId = roleResult.rows[0].id;

        // Delete the role assignment from the user_roles table
        await db.query(
            "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2",
            [userId, roleId]
        );

        return { message: "Role removed from user" };
    } catch (error) {
        throw error;
    }
}


const deleteUser = async (id) => {
    return db.query("DELETE FROM users WHERE id = $1", [id]);
};

module.exports = {
    findAll,
    findByUsername,
    findByEmail,
    findById,
    findByRole,
    addUser,
    assignRoleToUser,
    removeRoleFromUser,
    deleteUser,
};
