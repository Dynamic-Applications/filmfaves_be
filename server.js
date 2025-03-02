const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users-roles/users-roles-router");
const authRouter = require("./api/auth/auth-router");
const passResetsRouter = require("./api/passResets/passResets-router");

const server = express();

// Configure CORS
// const allowedOrigins = [
//     "http://localhost:3000", // Development frontend
//     process.env.UI_URL_PROD, // Production frontend
// ];
// server.use(
//     cors({
//         origin: allowedOrigins,
//         credentials: true, // Allow cookies or auth headers
//     })
// );

const allowedOrigins = [
    "http://localhost:3000",
    "https://filmfaves-nine.vercel.app",
];

server.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

// Handle preflight requests
server.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Parse JSON body
server.use(express.json());

// Define routes
server.use("/", welcomeRouter);
server.use("/movies", moviesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/passresets", passResetsRouter);

module.exports = server;
