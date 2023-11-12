const express = require("express");
const io = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// *load values from .env
dotenv.config();

// *create an instance of the app
const app = express();

// *middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// *routes

// *start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
