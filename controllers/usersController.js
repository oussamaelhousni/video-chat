const mongoose = require("mongoose")
const { catchAsync, appError, handleSearch } = require("../utils")
const { userEvents } = require("../events")
const { userModel, conversationModel } = require("../models")
const { CONNECTED_USERS } = require("../constants")

// @desc   Search users
// @route   GET /api/v1/users
// @access   Public
exports.searchUsers = catchAsync(async (req, res, next) => {
    const query = handleSearch(req.query.search, ["email", "fullName"])
    return res.status(201).json({
        type: "success",
        data: {
            users: await userModel.searchUsers(req.user, query),
        },
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.blockUser = catchAsync(async (req, res, next) => {
    const user = {
        _id: "655a46a9ccfe789981eb7abe",
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.blockUser(user, req.body.blockedUserId)
    return res.status(201).json({
        type: "success",
        message: "user blocked succesfully",
        userId: req.body.blockedUserId,
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.unBlockUser = catchAsync(async (req, res, next) => {
    const user = {
        _id: "655a46a9ccfe789981eb7abe",
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.unBlockUser(user, req.body.blockedUserId)
    return res.status(201).json({
        type: "success",
        message: "user unblocked successfully",
        userId: req.body.blockedUserId,
    })
})

// @desc   send a friend request
// @route   POST /api/v1/users/sendFriendRequest
// @access   private
// @socket send notification to client with the friend request
exports.sendFriendRequest = catchAsync(async (req, res, next) => {
    await userModel.sendFriendRequest(req.user, req.body.userId)

    userEvents.sendNotification(req.app.get("io"), req.body.userId, {
        fullName: req.user.fullName,
        profileImage: req.user.profileImage,
        _id: req.user._id,
    })
    return res.status(201).json({
        type: "success",
        message: "request sended successfully",
        userId: req.body.userId,
    })
})

// @desc   cancel a friend request
// @route   POST /api/v1/users/cancelFriendRequest
// @access   private
// @socket send removeNotification event to client to remove friend request notification
exports.cancelFriendRequest = catchAsync(async (req, res, next) => {
    await userModel.cancelFriendRequest(req.user, req.body.userId)
    userEvents.removeNotification(
        req.app.get("io"),
        req.user._id.toString(),
        req.body.userId
    )
    return res.status(201).json({
        type: "success",
        message: "request canceled successfully",
        userId: req.body.userId,
    })
})

// @desc   accept friend request from a user
// @route   POST /api/v1/users/acceptFriendRequest/:userId
// @access   private
exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
    await userModel.acceptFriendRequest(req.user, req.params.userId)
    await conversationModel.createConversation({
        userOne: req.user._id.toString(),
        userTwo: req.params.userId,
    })
    // send request accepted event so in the client side we can get the new conversation (we sent it to one who send it and accept it at the same time)
    userEvents.friendRequestAccepted(
        req.app.get("io"),
        req.params.userId,
        req.user._id.toString()
    )
    userEvents.friendRequestAccepted(
        req.app.get("io"),
        req.user._id.toString(),
        req.params.userId
    )
    return res.status(200).json({
        type: "success",
        message: "request accepted successfully",
    })
})

// @desc   decline friend request
// @route   POST /api/v1/users/declineFriendRequest/:userId
// @access   private
exports.declineFriendRequest = catchAsync(async (req, res, next) => {
    console.log("salam")
    await userModel.declineFriendRequest(req.user, req.params.userId)
    return res.status(200).json({
        type: "success",
        message: "request declined successfully",
    })
})

// @desc   cancel friend Request
// @route   POST /api/v1/users/cancelFriendRequest/:userId
// @access   private
exports.unfriend = catchAsync(async (req, res, next) => {
    await userModel.unfriend(req.user, req.params.userId)
    return res.status(200).json({
        type: "success",
        message: "unfriend successfully",
    })
})

// @desc   Get All friend requests
// @route   GET /api/v1/users/friendRequests
// @access   private
exports.getFriendRequests = catchAsync(async (req, res, next) => {
    return res.status(200).json({
        type: "success",
        data: await userModel.getFriendRequests(req.user),
    })
})
