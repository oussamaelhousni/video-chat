const mongoose = require("mongoose")
const messageModel = require("./messageModel")

const conversationSchema = new mongoose.Schema(
    {
        userOne: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "please provide user one"],
        },
        userTwo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "please provide user two"],
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
)

conversationSchema.virtual("lastMessage").get(async function () {
    const message = await messageModel
        .findOne({ conversation: this._id })
        .lean()
        .sort({ _id: -1 })
    return message
})

conversationSchema.virtual("nbrOfUnreadMessages").get(async function () {
    const nbrOfUnreadMessage = await messageModel
        .find({ conversation: this._id, isSeen: false })
        .lean()
        .count()
    return nbrOfUnreadMessage
})

const conversationModel = mongoose.model("Conversation", conversationSchema)

module.exports = conversationModel
