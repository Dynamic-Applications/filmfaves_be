const db = require("../../config/db");

const getAll = async () => {
    return db.query("SELECT * FROM movies")
}

const getById = async (id) => {

    const result = await db.query("SELECT * FROM movies WHERE movie_id = $1", [
        id,
    ]);
    return result.rows[0]; 
}


const addMovie = async (title, director, rate, genre, popular, description, image) => {
    return db.query(
        `INSERT INTO movies (title, director, rate, genre, popular, description, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, director, rate, genre, popular, description, image]
    );
}

const updateMovie = async (
    movie_id,
    title,
    director,
    rate,
    genre,
    popular,
    description,
    image
) => {
    return db.query(
        `UPDATE movies
        SET
            title = COALESCE($1, title),
            director = COALESCE($2, director),
            rate = COALESCE(NULLIF($3, '')::NUMERIC, rate),  -- Ensures rate is numeric
            genre = COALESCE($4, genre),
            popular = COALESCE($5, popular),
            description = COALESCE($6, description),
            image = COALESCE($7, image)
        WHERE movie_id = $8 RETURNING *`,
        [title, director, rate, genre, popular, description, image, movie_id]
    );
};

const removeMovie = async (id) => {
    return db.query('DELETE FROM movies WHERE movie_id = $1 RETURNING *', [id])
}

module.exports = {
    getAll,
    getById,
    addMovie,
    updateMovie,
    removeMovie,
}