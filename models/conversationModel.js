const mongoose = require("mongoose")
const messageModel = require("./messageModel")
const { appError } = require("../utils")

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
        /* isDeleteFromUserOne: {
            type: Boolean,
            default: false,
            select: false,
        },
        isDeleteFromUserTwo: {
            type: Boolean,
            default: false,
            select: false,
        },

        /*******************************************************************************************************************************/
        /* it helps us to implement the functionality that when a user deleted the conversation other user can still have the messages */
        /*******************************************************************************************************************************/

        deletedByUserOne: {
            isDeleted: {
                type: Boolean,
                default: false,
                select: false,
            },
            deletedAt: {
                type: Date,
                default: null,
                select: false,
            },
        },
        deletedByUserTwo: {
            isDeleted: {
                type: Boolean,
                default: false,
                select: false,
            },
            deletedAt: {
                type: Date,
                default: null,
                select: false,
            },
        },
    },
    {
        timestamps: true,
        virtuals: true,
    }
)

conversationSchema.virtual("lastMessage").get(async function () {
    console.log("Getting last message for conversation:", this._id)
    const message = await messageModel
        .findOne({ conversation: this._id })
        .sort({ _id: -1 })
    return message
})

conversationSchema.virtual("nbrOfUnreadMessages").get(async function () {
    const nbrOfUnreadMessage = await messageModel
        .find({ conversation: this._id, isSeen: false })
        .count()
    return nbrOfUnreadMessage
})

// delete conversation from user
conversationSchema.statics.getConversation = async function (
    conversationId,
    userId
) {
    const [conversationOne, conversationTwo] = await Promise.all([
        this.findOne({
            userOne: userId,
            _id: conversationId,
            "deletedByUserOne.isDeleted": false,
        }).populate({
            path: "userOne",
            select: {
                fullName: 1,
                profileImage: 1,
                _id: 1,
            },
        }),
        this.findOne({
            userTwo: userId,
            _id: conversationId,
            "deletedByUserTwo.isDeleted": false,
        }).populate({
            path: "userTwo",
            select: {
                fullName: 1,
                profileImage: 1,
                _id: 1,
            },
        }),
    ])

    if (conversationOne) {
        return conversationOne
    }

    if (conversationTwo) {
        return conversationTwo
    }
    throw new appError("Conversation not found", 404)
}

// delete conversation from user
conversationSchema.statics.deleteConversation = async function (
    conversationId,
    userId
) {
    const [conversationOne, conversationTwo] = await Promise.all([
        this.findOne({
            userOne: userId,
            _id: conversationId,
        }).select("+deletedByUserOne"),
        this.findOne({
            userTwo: userId,
            _id: conversationId,
        }).select("+deletedByUserTwo"),
    ])

    if (conversationOne) {
        conversationOne.deletedByUserOne.isDeleted = true
        conversationOne.deletedByUserOne.deletedAt = Date.now()
        await conversationOne.save()
        return
    }

    if (conversationTwo) {
        conversationTwo.deletedByUserTwo.isDeleted = true
        conversationTwo.deletedByUserTwo.deletedAt = Date.now()
        await conversationTwo.save()
        return
    }
}

// create conversation
conversationSchema.statics.createConversation = async function ({
    userOne,
    userTwo,
}) {
    console.log("users", { userOne, userTwo })
    // the user who request to create new  conversation also his id  is userOne
    const [conversationOne, conversationTwo] = await Promise.all([
        this.findOne({ userOne, userTwo }).select("deletedByUserOne"),
        this.findOne({ userOne: userTwo, userTwo, userOne }).select(
            "deletedByUserTwo"
        ),
    ])

    if (conversationOne) {
        conversationOne.deletedByUserOne.isDeleted = false
        await conversationOne.save()
        return
    }

    if (conversationTwo) {
        conversationTwo.deletedByUserTwo.isDeleted = false
        await conversationTwo.save()
        return
    }

    return await conversationModel.create({ userOne, userTwo })
}

// get all user conversations
conversationSchema.statics.getConversations = async function (user) {
    const conversations = await this.aggregate([
        {
            $match: {
                $or: [
                    {
                        userOne: user._id,
                    },
                    {
                        userTwo: user._id,
                    },
                ],
            },
        },
        {
            $addFields: {
                me: {
                    $cond: [
                        { $eq: [user._id, "$userOne"] },
                        "$userOne",
                        "$userTwo",
                    ],
                },
                deletedByMe: {
                    $cond: [
                        { $eq: [user._id, "$userOne"] },
                        "$deletedByUserOne",
                        "$deletedByUserTwo",
                    ],
                },
                him: {
                    $cond: [
                        { $ne: [user._id, "$userOne"] },
                        "$userOne",
                        "$userTwo",
                    ],
                },
            },
        },
        {
            $match: {
                "deletedByMe.isDeleted": false,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "him",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $lookup: {
                from: "messages",
                let: {
                    conversationId: "$_id",
                    me: "$me",
                },
                pipeline: [
                    {
                        $sort: {
                            _id: -1,
                        },
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: ["$$conversationId", "$conversation"],
                            },
                            $or: [
                                {
                                    $expr: {
                                        $eq: ["$$me", "$sender"],
                                        $eq: ["$isDeletedBySender", false],
                                    },
                                },
                                {
                                    $expr: {
                                        $eq: ["$$me", "$receiver"],
                                        $eq: ["$isDeleteByReceiver", false],
                                    },
                                },
                            ],
                        },
                    },

                    {
                        $limit: 1,
                    },
                    {
                        $project: {
                            _id: 1,
                            sender: 1,
                            receiver: 1,
                            type: 1,
                            text: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            isSeen: 1,
                            isDelivered: 1,
                            url: 1,
                            audio: 1,
                        },
                    },
                ],
                as: "lastMessage",
            },
        },
        {
            $unwind: "$user",
        },
        {
            $unwind: {
                path: "$lastMessage",
                preserveNullAndEmptyArrays: true,
            },
        },
    ])
    return conversations
}

conversationSchema.index({ userOne: 1, userTwo: 1 }, { unique: true })

const conversationModel = mongoose.model("Conversation", conversationSchema)

module.exports = conversationModel
