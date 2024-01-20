const { CONNECTED_USERS } = require("../constants")

// send socket message with friend request
exports.sendNotification = (io, userId, notification) => {
    // get list of socket ids of a user (user may open multiple tabs)
    CONNECTED_USERS.get(userId)?.forEach((to) => {
        io.to(to).emit("notification", notification)
    })
}

// remove notification when a user cancel his friend request
exports.removeNotification = (io, userId, endUserId) => {
    CONNECTED_USERS.get(endUserId)?.forEach((to) => {
        io.to(to).emit("removeNotification", userId)
    })
}
