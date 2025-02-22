const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users-roles/users-roles-router");
const authRouter = require("./api/auth/auth-router");
const passResetsRouter = require("./api/pass-resets/pass-resets-router");

const server = express();

// Configure CORS
const allowedOrigins = [
    "http://localhost:3000", // Development frontend
    process.env.UI_URL_PROD, // Production frontend
];
server.use(
    cors({
        origin: allowedOrigins,
        credentials: true, // Allow cookies or auth headers
    })
);

// Parse JSON body
server.use(express.json());

// Define routes
server.use("/", welcomeRouter);
server.use("/movies", moviesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/passresets", passResetsRouter);

module.exports = server;
