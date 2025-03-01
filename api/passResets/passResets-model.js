const db = require("../../config/db");
const crypto = require("crypto");

const findByEmail = async (email) => {
    return db.query(
        `SELECT users.id, users.username, users.email, users.password,
        ARRAY_AGG(roles.role_name) AS roles 
        FROM users 
        LEFT JOIN user_roles ON users.id = user_roles.user_id 
        LEFT JOIN roles ON user_roles.role_id = roles.id 
        WHERE users.email = $1 
        GROUP BY users.id, users.password`,
        [email]
    );
};


// Find user by reset token
const findByResetToken = async (resetToken) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const result = await db.query(
            `SELECT * FROM users 
            WHERE reset_password_token = $1 
            AND reset_password_token_expires > NOW()`,
            [hashedToken]
        );

        if (!result.rows || result.rows.length === 0) {
            console.log("No user found with the provided reset token.");
            return null; // Return null if no user found
        }

        console.log("Database result for reset token:", result.rows);

        return result; // Returns user if token is valid and not expired
    } catch (err) {
        console.error("Error during the token lookup:", err);
        throw err;
    }
};


const generateResetToken = async (email) => {
    try {
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // Token expires in 1 hour

        const result = await db.query(
            `UPDATE users 
            SET reset_password_token = $1, reset_password_token_expires = $2 
            WHERE email = $3 
            RETURNING id, username, email, reset_password_token, reset_password_token_expires`,
            [token, expires, email]
        );

        if (result.rows.length === 0) {
            throw new Error("User with the provided email does not exist");
        }

        return result.rows[0]; // Return the updated user with the reset token
    } catch (error) {
        throw error;
    }
};

// Reset the password using the token
const resetPassword = async (token, newPassword) => {
    try {
        const result = await db.query(
            `UPDATE users 
            SET password = $1, reset_password_token = NULL, reset_password_token_expires = NULL 
            WHERE reset_password_token = $2 
            AND reset_password_token_expires > NOW() 
            RETURNING id, username, email`,
            [newPassword, token]
        );

        if (result.rows.length === 0) {
            throw new Error("Invalid or expired reset token");
        }

        return result.rows[0]; // Return the updated user after password reset
    } catch (error) {
        throw error;
    }
};

// Add reset token and expiration to a user record
const updateResetToken = async (email, resetToken, expiry) => {
    try {
        const result = await db.query(
            `UPDATE users 
            SET reset_password_token = $1, reset_password_token_expires = to_timestamp($2)
            WHERE email = $3 
            RETURNING *`,
            [resetToken, Math.floor(expiry / 1000), email]
        );

        return result.rows[0]; // Returns updated user record
    } catch (err) {
        throw err;
    }
};

// Update user's password
const updatePassword = async (userId, newPassword) => {
    try {
        const result = await db.query(
            `UPDATE users 
            SET password = $1, reset_password_token = NULL, reset_password_token_expires = NULL 
            WHERE id = $2 
            RETURNING *`,
            [newPassword, userId]
        );

        return result.rows[0]; // Return updated user with new password
    } catch (err) {
        throw err;
    }
};

module.exports = {
    findByEmail,
    findByResetToken,
    generateResetToken,
    resetPassword,
    updateResetToken,
    updatePassword,   
};