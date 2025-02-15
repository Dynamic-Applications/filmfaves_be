exports.seed = async function (knex) {
    // Clear existing entries
    await knex("user_roles").del();
    await knex("users").del();
    await knex("roles").del();

    // Insert roles first
    const roles = await knex("roles")
        .insert([
            { role_name: "admin" },
            { role_name: "user" },
            { role_name: "guest" },
        ])
        .returning("*"); // Gets inserted roles with IDs

    // Insert users
    const users = await knex("users")
        .insert([
            {
                username: "adminUser",
                email: "admin@example.com",
                password: "adminPassword",
            },
            {
                username: "normalUser",
                email: "user@example.com",
                password: "userPassword",
            },
            {
                username: "guestUser",
                email: "guest@example.com",
                password: "guestPassword",
            },
        ])
        .returning("*"); // Gets inserted users with IDs

    // Map users to roles (assign roles properly)
    const userRoles = [
        {
            user_id: users[0].id,
            role_id: roles.find((r) => r.role_name === "admin").id,
        },
        {
            user_id: users[1].id,
            role_id: roles.find((r) => r.role_name === "user").id,
        },
        {
            user_id: users[2].id,
            role_id: roles.find((r) => r.role_name === "guest").id,
        },
    ];

    // Insert user-role relationships
    await knex("user_roles").insert(userRoles);
};
