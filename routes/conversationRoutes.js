const express = require("express")

const { conversationsController } = require("../controllers")

const router = express.Router()

router.route("/").post(conversationsController.createConversation)

router
    .route("/:id")
    .delete(conversationsController.deleteConversation)
    .get(conversationsController.getConversation)

module.exports = router
