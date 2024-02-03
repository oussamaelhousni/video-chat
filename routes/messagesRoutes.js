const express = require("express")

const { CONNECTED_USERS } = require("../constants")
const { messagesController } = require("../controllers")
const { upload, protect } = require("../middlewares")

const router = express.Router({ mergeParams: true })

const addTypeFieldToBody = (req, res, next) => {
    req.body.type = req.body.type || "text"
    if (req.body.type === "video") {
        req.body.url = req.files.video[0]?.filename
    }
    if (req.body.type === "audio") {
        req.body.url = req.files.audio[0]?.filename
    }
    if (req.body.type === "image") {
        req.body.url = req.files.image[0]?.filename
    }
    next()
}

const isDelivered = (req, res, next) => {
    req.body.isDelivered = CONNECTED_USERS.get(req.body.receiver) ? true : false
    next()
}

router
    .route("/")
    .post(
        protect,

        upload.fields([
            { name: "image", maxCount: 1 },
            { name: "video", maxCount: 1 },
            { name: "audio", maxCount: 1 },
        ]),

        addTypeFieldToBody,
        isDelivered,
        messagesController.createMessage
    )
    .get(protect, messagesController.getMessages)

module.exports = router
