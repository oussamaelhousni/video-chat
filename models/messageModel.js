const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "please provide the sender"],
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "please provide the sender"],
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
            required: [true, "please provide a conversation"],
        },
        type: {
            type: String,
            enum: ["audio", "text", "call", "video"],
            default: "text",
        },
        // place of the media on the disk
        url: String,
        // the buffer of the audio stored on db
        audio: {
            type: mongoose.Schema.Types.Buffer,
        },
        isSeen: {
            type: Boolean,
            default: false,
        },
        text: String,
    },
    { timestamps: true }
)

const messageModel = mongoose.model("Message", messageSchema)

module.exports = messageModel
