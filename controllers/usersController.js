const mongoose = require("mongoose")
const { catchAsync, appError, handleSearch } = require("../utils")
const { userModel } = require("../models")

// @desc   Search users
// @route   GET /api/v1/users
// @access   Public
exports.searchUsers = catchAsync(async (req, res, next) => {
    const user = await userModel.findById("655a46a9ccfe789981eb7abe")

    const query = handleSearch(req.query.search, ["email", "fullName"])
    return res.status(201).json({
        type: "success",
        data: {
            users: await userModel.searchUsers(user, query),
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
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.sendFriendRequest = catchAsync(async (req, res, next) => {
    console.log("hi")
    const user = {
        _id: new mongoose.Types.ObjectId("655a46a9ccfe789981eb7abe"),
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.sendFriendRequest(user, req.body.userId)
    return res.status(201).json({
        type: "success",
        message: "request sended successfully",
        userId: req.body.userId,
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.cancelFriendRequest = catchAsync(async (req, res, next) => {
    const user = {
        _id: new mongoose.Types.ObjectId("655a46a9ccfe789981eb7abe"),
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.cancelFriendRequest(user, req.body.userId)
    return res.status(201).json({
        type: "success",
        message: "request canceled successfully",
        userId: req.body.userId,
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
    const user = {
        _id: new mongoose.Types.ObjectId("655a46a9ccfe789981eb7abe"),
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.acceptFriendRequest(user, req.params.userId)
    return res.status(201).json({
        type: "success",
        message: "unfriend successfully",
    })
})

// @desc   Search users
// @route   POST /api/v1/users/block
// @access   private
exports.unfriend = catchAsync(async (req, res, next) => {
    const user = {
        _id: new mongoose.Types.ObjectId("655a46a9ccfe789981eb7abe"),
        fullName: "oussama elhousni",
        email: "oussamaelhousni94@gmail.com",
        profileImage: "",
        active: true,
        __v: 0,
        pendingRequests: ["658724ccf671f52a0e799e39"],
        blockedFriends: ["6591851c3e718feabbc24f37"],
        friends: ["6591852d3e718feabbc24f38"],
    }
    await userModel.unfriend(user, req.params.userId)
    return res.status(201).json({
        type: "success",
        message: "unfriend successfully",
    })
})
