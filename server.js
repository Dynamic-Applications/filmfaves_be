const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users/users-router");
const authRouter = require("./api/auth/auth-router");
const rolesRouter = require("./api/roles/roles-router");

const server = express();

// Configure CORS
const allowedOrigins = [
    "http://localhost:3000",           // Development frontend
    "https://filmfaves-nine.vercel.app" // Production frontend
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
server.use("/roles", rolesRouter);

module.exports = server;
