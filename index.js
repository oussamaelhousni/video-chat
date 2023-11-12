const express = require("express");
const io = require("socket.io");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// local modules
const connectToDatabase = require("./utils/connectToDatabase");

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

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(() => {
    console.log("Error while connecting to database");
  });
