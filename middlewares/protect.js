const { promisify } = require("node:util")
const jwt = require("jsonwebtoken")
const { userModel, tokenModel } = require("../models")
const { appError, catchAsync } = require("../utils")

const protect = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token || (await tokenModel.findOne({ token })))
        throw new appError("you're not authenticated", 401)
    const verifyToken = promisify(jwt.verify)
    const decoded = await verifyToken(token, process.env.JWT_ACCESS_SECRET)
    const user = await userModel.findById(decoded.id)
    if (!user) throw new appError("User not exists any more", 404)
    req.user = user
    req.token = token
    return next()
})

module.exports = protect
