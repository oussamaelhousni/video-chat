const { Server } = require("socket.io")

function createSocketServer(server) {
    const io = new Server(server)

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`)
    })
    return io
}

module.exports = createSocketServer
