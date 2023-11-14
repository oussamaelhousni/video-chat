const express = require("express")
const {
    login,
    register,
    confirmEmail,
    forgetPassword,
    resetPassword,
} = require("../controllers/authController")

const router = express.Router()

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/confirm/:id/:emailConfirmationCode").all(confirmEmail)
router.route("/forget-password").post(forgetPassword)
router.route("/reset-password/:id").post(resetPassword)

module.exports = router
