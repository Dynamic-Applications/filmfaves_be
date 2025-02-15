const db = require("../../config/db");

const findAll = async () => {
    return db.query("SELECT * FROM roles");
};

const findById = async (id) => {
    return db.query("SELECT * FROM roles WHERE id = $1", [id]);
};

const addRole = async (role_name) => {
    return db.query("INSERT INTO roles (role_name) VALUES ($1) RETURNING *", [
        role_name,
    ]);
};

const deleteRole = async (id) => {
    return db.query("DELETE FROM roles WHERE id = $1", [id]);
};

const findUsersByRole = async (role_name) => {
    return db.query(
        `SELECT users.id, users.username, users.email 
        FROM users 
        JOIN user_roles ON users.id = user_roles.user_id 
        JOIN roles ON user_roles.role_id = roles.id 
        WHERE roles.role_name = $1`,
        [role_name]
    );
};

module.exports = {
    findAll,
    findById,
    addRole,
    deleteRole,
    findUsersByRole,
};
