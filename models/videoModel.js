const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender is required"],
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Receiver is required"],
        },
        callStart: Date,
        callEnd: Date,
        isStarted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const videoModel = mongoose.model("Video", videoSchema)
module.exports = videoModel
