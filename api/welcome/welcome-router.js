const express = require("express");

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        res.json({ message: "API is live!" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
