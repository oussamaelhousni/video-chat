const express = require("express")
const { messagesController } = require("../controllers")

const router = express.Router({ mergeParams: true })

router.route("/").post(messagesController.createMessage)

module.exports = router
