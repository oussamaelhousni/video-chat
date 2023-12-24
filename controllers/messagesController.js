const { messageModel } = require("../models")
const { appError, catchAsync } = require("../utils")

// Route: POST /api/v1/conversations/:conversationId/messages
// Description: create new message in a conversation
// Access: Private
exports.createMessage = catchAsync(async (req, res, next) => {
    const io = req.app.get("io")
    const CONNECTED_USERS = req.app.get("CONNECTED_USERS")

    if (!req.params.conversationId)
        return next(new appError("Please provide conversation id", 400))

    const { sender, receiver, text } = req.body

    const message = await messageModel.create({
        sender,
        receiver,
        text,
        conversation: req.params.conversationId,
    })

    if (
        CONNECTED_USERS.get(receiver) &&
        CONNECTED_USERS.get(receiver).length > 0
    ) {
        CONNECTED_USERS.get(receiver).forEach((id) => {
            io.to(id).emit("message", message)
        })
    }

    return res.status(201).json("ji")
})
