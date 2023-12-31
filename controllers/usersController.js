const { catchAsync, appError, handleSearch } = require("../utils")
const { userModel } = require("../models")
// @desc   Search users
// @route   GET /api/v1/users
// @access   Public
exports.searchUsers = catchAsync(async (req, res, next) => {
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

    const query = handleSearch(req.query.search, ["email", "fullName"])
    return res.status(201).json({
        type: "success",
        data: {
            users: await userModel.searchUsers(user, query),
        },
    })
})
