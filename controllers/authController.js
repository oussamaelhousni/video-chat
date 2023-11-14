const { userModel } = require("../models")
const { catchAsync, appError } = require("../utils")
const createJwt = require("../utils/createJwt")

// @desc   create new user
// @route   POST /api/v1/auth/register
// @access   Public
const register = catchAsync(async (req, res, next) => {
    await userModel.create(req.body)
    res.status(200).json({
        status: "success",
        message: "User created successfully",
    })
})

// @desc   confirm email of new user
// @route   POST /api/v1/auth/confirm/:id/:emailConfirmationCode
// @access   Public
const confirmEmail = catchAsync(async (req, res, next) => {
    const { id, emailConfirmationCode } = req.params
    const user = await userModel
        .findOne({ _id: id, emailConfirmationCode })
        .select("+active")
    if (!user) throw new appError("User not found", 404)
    await user.activateUserAccount()
    res.status(200).json({
        status: "success",
        message: "Account activated succesfully",
    })
})

// @desc   login in
// @route   POST /api/v1/auth/login
// @access   Public
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).select("+password")
    if (!user || !(await user.comparePasswords(user.password, password)))
        throw new appError("Invalid Credentials", 400)

    // generate token and send it to the client
    return res.status(200).json({
        status: "success",
        data: {
            token: await createJwt(user._id),
        },
    })
})

// @desc   reset password
// @route   POST /api/v1/auth/forget-password
// @access   Public
const forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await userModel.findOne({ email })
    if (!user) throw new appError("Email does not exist", 404)
    await user.createResetToken()
    return res.status(200).json({
        status: "success",
        message: "reset token is sent to your email",
    })
})

// @desc   reset password
// @route   POST /api/v1/auth/reset-password/:id?token=xxxxxxxxxxxxx
// @access   Public
const resetPassword = catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body
    const user = await userModel.findOne({
        _id: req.params.id,
        passwordResetToken: req.query.token,
        passwordResetExpireDate: { $gt: Date.now() },
    })
    if (!user) throw new appError("User not found", 404)
    await user.setPassword(password, passwordConfirm)
    return res.status(200).json({
        status: "success",
        message: "password reset successfully",
    })
})

module.exports = {
    register,
    confirmEmail,
    login,
    forgetPassword,
    resetPassword,
}
