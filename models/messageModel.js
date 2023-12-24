const mongoose = require("mongoose")

const callSchema = new mongoose.Schema({
    isAnswered: {
        type: Boolean,
        default: false,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
    startedAt: {
        type: Date,
        default: Date.now(),
    },
    endedAt: Date,
    type: {
        type: String,
        enum: ["video", "audio"],
    },
})

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
        //call
        call: callSchema,
        isDelivered: {
            type: Boolean,
            default: false,
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
