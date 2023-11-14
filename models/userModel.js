const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const os = require("os")
const { sendMail, codeGenerator, appError } = require("../utils")

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name  is required"],
        },
        email: {
            type: String,
            unique: [true, "Email already exists"],
            validate: [validator.isEmail, "Email is invalid"],
        },
        password: {
            type: String,
            select: false,
            minlength: [8, "Password must be at least 8 characters long"],
            maxLength: [20, "Password cannot exceed 20 characters"],
            required: [true, "Password is required"],
        },
        passwordConfirm: {
            type: String,
            select: false,
            minlength: [
                8,
                "Password confirmation must be at least 8 characters long",
            ],
            maxLength: [
                20,
                "Password confirmation cannot exceed 20 characters",
            ],
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (val) {
                    return this.password === val
                },
                message: "Passwords do not match",
            },
        },
        role: {
            type: String,
            enum: ["admin", "user"],
        },
        passwordResetToken: String,
        passwordResetExpireDate: Date,
        emailConfirmationCode: {
            type: String,
            default: codeGenerator(),
        },
        active: {
            default: false,
            type: Boolean,
            select: false,
        },
    },
    {
        timestamps: true,
    }
)

// hash the password before save user to database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre("save", async function (next) {
    console.log(`A new user has been created with id ${this._id}`)
    if (!this.isNew) return next()
    // confirmation url
    const confirmationLink = `${
        process.env.NODE_ENV === "development"
            ? process.env.WEBSITE_DEV
            : process.env.WEBSITE_PROD
    }/api/v1/auth/confirm/${this._id}/${this.emailConfirmationCode}`

    // mail template
    const html = `
            <h3>Hi ,${this.fullName}</h3>
            <p>Welcome to our video chat app this your confirmation link : <br />
            <a href="${confirmationLink}">Click here to confirm your email</a>
            </p>
  `
    if (
        !(await new sendMail().send(
            this.email,
            "Password confirmation",
            html,
            confirmationLink
        ))
    ) {
        throw new appError("Error in sending email please try again later", 500)
    }
    next()
})

// compare password when login in
userSchema.methods.comparePasswords = async function (
    password,
    candidatePassword
) {
    return await bcrypt.compare(candidatePassword, password)
}

// activate user account
userSchema.methods.activateUserAccount = async function () {
    if (this.active) throw new appError("Account already activated", 400)
    this.active = true
    this.emailConfirmationCode = undefined
    await this.save({ validateBeforeSave: false })
}

// send password reset Token
userSchema.methods.createResetToken = async function () {
    this.passwordResetToken = codeGenerator(20)
    this.passwordResetExpireDate = new Date(Date.now() + 15 * 1000 * 60)
    await this.save({ validateBeforeSave: false })
    const resetLink = `${
        process.env.NODE_ENV === "development"
            ? process.env.WEBSITE_DEV
            : process.env.WEBSITE_PROD
    }/reset-password/${this._id}?token=${this.passwordResetToken}`
    const html = `
            <h3>Hi ,${this.fullName}</h3>
            <p>Welcome to our video chat app this your reset password link : <br />
            <a href="${resetLink}">Click here to reset your password</a>
            </p>
  `
    if (!new sendMail().send(this.email, "Reset password", html, resetLink)) {
        this.passwordResetExpireDate = undefined
        this.passwordResetExpireDate = undefined
        throw new appError("Error in sending email please try again later", 500)
    }
}

// change password
userSchema.methods.setPassword = async function (password, passwordConfirm) {
    this.password = password
    this.passwordConfirm = passwordConfirm
    await this.save()
    this.passwordResetExpireDate = undefined
    this.passwordResetToken = undefined
    await this.save()
}
module.exports = mongoose.model("User", userSchema)
