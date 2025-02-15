const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users/users-router");
const authRouter = require("./api/auth/auth-router");
const rolesRouter = require("./api/roles/roles-router");

const server = express()

server.use(cors());
server.use(express.json());

server.use("/", welcomeRouter);
server.use("/movies", moviesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/roles", rolesRouter);

module.exports = server;