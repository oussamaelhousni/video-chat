const express = require("express")
const messagesRouter = require("./messagesRoutes")

const { conversationsController } = require("../controllers")

const router = express.Router()

router.use("/:conversationId/messages", messagesRouter)

router.route("/").post(conversationsController.createConversation)

router
    .route("/:id")
    .delete(conversationsController.deleteConversation)
    .get(conversationsController.getConversation)

module.exports = router
