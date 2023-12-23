const express = require("express")

const { conversationsController } = require("../controllers")

const router = express.Router()

router.route("/").post(conversationsController.createConversation)

module.exports = router
