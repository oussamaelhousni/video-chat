const express = require("express")

const { conversationsController } = require("../controllers")

const router = express.Router()

router("/").post(conversationsController.createConversation)

module.exports = router
