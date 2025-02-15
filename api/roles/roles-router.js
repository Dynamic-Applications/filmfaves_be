const express = require("express")
const router = express.Router()

const Role = require("./roles-model");
const { restricted } = require("../auth/auth-middleware");

router.get("/", restricted, async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve roles: ${err.message}`,
        });
    }
})

module.exports = router;