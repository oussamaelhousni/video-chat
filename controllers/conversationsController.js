const { catchAsync, appError } = require("../utils")
const { conversationModel } = require("../models")

// Route: POST /api/v1/conversations
// Description: Create a new conversation
// Access: Private
exports.createConversation = catchAsync(async (req, res, next) => {
    const conversation = await conversationModel.create(req.body)
    return res.status(201).json({
        status: "success",
        data: { conversation },
    })
})
