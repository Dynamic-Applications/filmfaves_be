// exports.up = function (knex) {
//     return (
//         knex.schema
//             // Create the roles table first
//             .createTable("roles", (table) => {
//                 table.increments("id"); // Primary key for the roles table
//                 table.string("role_name", 128).unique().notNullable(); // Role names (admin, user, guest)
//             })
//             // Create the users table
//             .createTable("users", (table) => {
//                 table.increments("id");
//                 table.string("username", 128).unique().notNullable();
//                 table.string("email", 128).unique().notNullable();
//                 table.string("password", 256).notNullable();
//                 table.string("reset_password_token", 256);
//                 table.timestamp("reset_password_token_expires");
//             })
//             // Create the user_roles table for the many-to-many relationship
//             .createTable("user_roles", (table) => {
//                 table.increments("id"); // Primary key for the user_roles table
//                 table
//                     .integer("user_id")
//                     .unsigned()
//                     .notNullable()
//                     .references("id")
//                     .inTable("users")
//                     .onDelete("CASCADE");
//                 table
//                     .integer("role_id")
//                     .unsigned()
//                     .notNullable()
//                     .references("id")
//                     .inTable("roles")
//                     .onDelete("CASCADE");
//                 table.unique(["user_id", "role_id"]); // Ensure each user has unique role entries
//             })
//     );
// };

// exports.down = function (knex) {
//     return knex.schema
//         .dropTableIfExists("user_roles") // Drop user_roles first
//         .dropTableIfExists("users") // Then drop users
//         .dropTableIfExists("roles"); // Finally, drop roles
// };


exports.up = function (knex) {
    return (
        knex.schema
            // Create the roles table first
            .createTable("roles", (table) => {
                table.increments("id"); // Primary key
                table.string("role_name", 128).unique().notNullable(); // Role names (e.g., admin, user)
                table.timestamps(true, true); // Adds created_at and updated_at
            })
            // Create the users table
            .createTable("users", (table) => {
                table.increments("id");
                table.string("username", 128).unique().notNullable();
                table.string("email", 128).unique().notNullable();
                table.string("password", 256).notNullable();
                table.string("reset_password_token", 256); // For password reset
                table.timestamp("reset_password_token_expires"); // Token expiration time
                table.timestamps(true, true); // Adds created_at and updated_at
            })
            // Create the user_roles table for the many-to-many relationship
            .createTable("user_roles", (table) => {
                table.increments("id"); // Primary key for the user_roles table
                table
                    .integer("user_id")
                    .unsigned()
                    .notNullable()
                    .references("id")
                    .inTable("users")
                    .onDelete("CASCADE"); // Cascade delete for user roles
                table
                    .integer("role_id")
                    .unsigned()
                    .notNullable()
                    .references("id")
                    .inTable("roles")
                    .onDelete("CASCADE"); // Cascade delete for role entries
                table.unique(["user_id", "role_id"]); // Ensure each user has unique role entries
            })
    );
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("user_roles") // Drop user_roles first
        .dropTableIfExists("users") // Then drop users
        .dropTableIfExists("roles"); // Finally, drop roles
};
