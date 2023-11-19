const express = require("express")
const {
    login,
    register,
    logout,
    confirmEmail,
    forgetPassword,
    resetPassword,
    resendConfirmationMail,
} = require("../controllers/authController")
const { protect } = require("../middlewares")

const router = express.Router()

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/logout").post(protect, logout)
router.route("/confirm/:id/:emailConfirmationCode").all(confirmEmail)
router.route("/forget-password").post(forgetPassword)
router.route("/reset-password/:id").post(resetPassword)
router.route("/resend-confirmation-email").post(resendConfirmationMail)

module.exports = router
