const { Server } = require("socket.io")
const { CONNECTED_USERS } = require("./constants")

function createSocketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:4000"],
            credentials: true,
        },
    })

    io.on("connect", (socket) => {
        // this event is should be fired whenever a user connected to our server
        console.log("new user")
        socket.on("init", (payload) => {
            let data = payload
            if (typeof payload === "string") {
                data = JSON.parse(payload)
            }
            console.log(data.userId)
            // store connected users in map so we can send messages to them later
            CONNECTED_USERS.set(data.userId, [
                ...new Set([
                    ...(CONNECTED_USERS.get(data.userId) || []),
                    socket.id,
                ]),
            ])
        })
    })
    return io
}

module.exports = createSocketServer
