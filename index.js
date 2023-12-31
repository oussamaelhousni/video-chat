const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")

// local modules
const { CONNECTED_USERS } = require("./constants")
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
app.use(
    cors({
        origin: ["http://localhost:5173"],
    })
)
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
        server.listen(PORT, "127.0.0.1", () => {
            // share socket emitter over the app
            app.set("io", io)
            app.set("CONNECTED_USERS", CONNECTED_USERS)
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch(() => {
        console.log("Error while connecting to database")
    })
