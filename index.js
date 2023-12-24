const http = require("http")
const express = require("express")
const os = require("os")
const { Server } = require("socket.io")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")

// local modules
const createSocketServer = require("./socketServer")
const { connectToDatabase } = require("./utils")
const { globalErrorHandler } = require("./controllers")
// routers
const { authRouter, conversationRouter } = require("./routes")

// load values from .env
dotenv.config()

// create an instance of the app
const app = express()

// *middlewares
app.use(cors())
app.use(express.json())
if (process.env.NODE_ENV === "development") app.use(morgan("dev"))

// routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/conversations", conversationRouter)

// global error handler
app.use(globalErrorHandler)

// start server
const PORT = process.env.PORT || 8080
const server = http.createServer(app)

io = createSocketServer(server)

connectToDatabase()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch(() => {
        console.log("Error while connecting to database")
    })
