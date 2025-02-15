exports.up = function(knex) {
  return knex.schema.createTable("movies", (table) => {
    table.increments("movie_id");
    table.string("title", 500).unique();
    table.string("director", 500).notNullable();
    table.decimal("rate", 5, 2).notNullable();
    table.string("genre", 500);
    table.boolean("popular");
    table.string("description", 2000).notNullable();
    table.string("image", 2000).notNullable();
});
};

exports.down = function(knex) {
  return knex.schema.dropTable("movies");
};
