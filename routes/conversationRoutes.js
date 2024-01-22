const express = require("express")
const messagesRouter = require("./messagesRoutes")
const { protect } = require("../middlewares")
const { conversationsController } = require("../controllers")

const router = express.Router()

router.use("/:conversationId/messages", messagesRouter)

router
    .route("/")
    .post(conversationsController.createConversation)
    .get(protect, conversationsController.getUserConversations)

router
    .route("/:id")
    .delete(conversationsController.deleteConversation)
    .get(conversationsController.getConversation)

module.exports = router
