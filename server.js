const express = require("express");
const cors = require("cors");

const welcomeRouter = require("./api/welcome/welcome-router");
const moviesRouter = require("./api/movies/movies-router");
const usersRouter = require("./api/users/users-router");
const authRouter = require("./api/auth/auth-router");
const rolesRouter = require("./api/roles/roles-router");

const server = express();
// server.use(cors());

// Define allowed origins
const allowedOrigins = [
    "http://localhost:3000", // On local SERVER
    process.env.UI_URL_PROD, // On deployment server
];

// Configure CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error("Not allowed by CORS")); // Reject the origin
        }
    },
    credentials: true, // If you need to support cookies or Authorization headers
};

// Use CORS middleware with options
server.use(cors(corsOptions));

// Parse JSON body
server.use(express.json());

// Define routes
server.use("/", welcomeRouter);
server.use("/movies", moviesRouter);
server.use("/users", usersRouter);
server.use("/auth", authRouter);
server.use("/roles", rolesRouter);

module.exports = server;
