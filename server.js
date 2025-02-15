const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users/users-router");
const authRouter = require("./api/auth/auth-router");
const rolesRouter = require("./api/roles/roles-router");

const server = express()

// CORS middleware with more control
const corsOptions = {
  origin: "http://localhost:3002", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies or authentication info (optional)
};

// Apply CORS middleware
server.use(cors(corsOptions));
server.use(cors());
server.use(express.json());

// Handle preflight OPTIONS requests
server.options("*", cors(corsOptions)); // Handle preflight for all routes

// Define routes
server.use("/", welcomeRouter);
server.use("/movies", moviesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/roles", rolesRouter);

module.exports = server;