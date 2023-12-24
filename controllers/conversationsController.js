const { catchAsync, appError } = require("../utils")
const { conversationModel } = require("../models")

// Route: POST /api/v1/conversations
// Description: Create a new conversation
// Access: Private
exports.createConversation = catchAsync(async (req, res, next) => {
    const conversation = await conversationModel.createConversation(req.body)
    return res.status(201).json({
        status: "success",
        data: { conversation },
    })
})

// Route: POST /api/v1/conversations/:id
// Description: delete a conversation (just from the user who request to delete it)
// Access: Private
exports.deleteConversation = catchAsync(async (req, res, next) => {
    await conversationModel.deleteConversation(req.params.id, req.body.user)

    return res.status(204).json({
        status: "success",
        message: "conversation deleted successfully",
    })
})

// Route: POST /api/v1/conversations/:id
// Description: get one conversation
// Access: Private
exports.getConversation = catchAsync(async (req, res, next) => {
    const conversation = await conversationModel.getConversation(
        req.params.id,
        req.body.user
    )

    return res.status(200).json({
        status: "success",
        data: { conversation },
    })
})
