const mongoose = require("mongoose")
const userModel = require("./userModel")
const conversationModel = require("./conversationModel")

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
        isDeletedBySender: {
            type: Boolean,
            default: false,
        },
        isDeletedByReceiver: {
            type: Boolean,
            default: false,
        },
        text: String,
    },
    { timestamps: true }
)

messageSchema.statics.getConversationMessages = async function (
    conversationId,
    userId
) {
    const messages = await this.aggregate([
        {
            $sort: {
                _id: 1,
            },
        },
        {
            $match: {
                conversation: new mongoose.Types.ObjectId(conversationId),
                $or: [
                    {
                        sender: userId,
                        isDeletedBySender: false,
                    },
                    {
                        receiver: userId,
                        isDeletedByReceiver: false,
                    },
                ],
            },
        },
    ])

    const receiver = await conversationModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(conversationId),
            },
        },
        {
            $project: {
                receiverInfo: {
                    $cond: [
                        {
                            $ne: [
                                "$userOne",
                                new mongoose.Types.ObjectId(userId),
                            ],
                        },
                        "$userOne",
                        "$userTwo",
                    ],
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "receiverInfo",
                foreignField: "_id",
                as: "receiver",
            },
        },
        { $unwind: "$receiver" },
        {
            $project: {
                "receiver.fullName": 1,
                "receiver.profileImage": 1,
                "receiver.email": 1,
                "receiver._id": 1,
            },
        },
    ])
    return {
        messages: messages || [],
        receiver: receiver[0]?.receiver || null,
    }
}

const messageModel = mongoose.model("Message", messageSchema)

module.exports = messageModel
