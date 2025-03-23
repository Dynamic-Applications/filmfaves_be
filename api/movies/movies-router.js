const Movie = require("./movies-model");
const router = require("express").Router();
const { restricted } = require("../auth/auth-middleware");

router.get("/", restricted, async (req, res) => {
    try {
        const result = await Movie.getAll();
        if (!result.rows || result.rows.length === 0) {
            return res.status(404).json({ message: "No movies found." });
        }
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve movies: ${err.message}`,
        });
    }
});

router.get("/:id", restricted, async (req, res) => {
    try {
        const id = req.params.id;

        const result = await Movie.getById(id);

        if (!result) {
            return res.status(404).send("Movie not found");
        }

        // Wrap the result in an array
        res.json([result]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, director, rate, genre, popular, description, image } =
            req.body;

        const result = await Movie.addMovie(
            title,
            director,
            rate,
            genre,
            popular,
            description,
            image
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.put("/:id", async (req, res) => {
    const { title, director, rate, genre, popular, description, image } =
        req.body;

    try {
        const result = await Movie.updateMovie(
            req.params.id,
            title,
            director,
            rate,
            genre,
            popular,
            description,
            image
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Movie not found");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const movie = await Movie.getById(id);
        console.log("Fetched Movie:", movie.title);

        if (!movie) {
            return res.status(404).send("Movie not found");
        }

        const result = await Movie.removeMovie(id);

        if (result.rows.length === 0) {
            return res.status(404).send("Movie not found");
        }

        res.send(`The movie "${movie.title}" has been deleted successfully.`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
