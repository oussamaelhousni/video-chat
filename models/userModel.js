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
        pendingRequests: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        friends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        blockedFriends: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        profileImage: {
            type: String,
            default: "",
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
    this.sendConfirmationMail()
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
    new sendMail()
        .send(this.email, "Reset password", html, resetLink)
        .catch(() => {
            this.passwordResetExpireDate = undefined
            this.passwordResetExpireDate = undefined
        })
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

// resend confirmation mail
userSchema.methods.sendConfirmationMail = async function () {
    if (this.active) throw new appError("Your account already activated", 400)
    // confirmation url
    const confirmationLink = `${
        process.env.NODE_ENV === "development"
            ? process.env.WEBSITE_DEV
            : process.env.WEBSITE_PROD
    }/confirm/${this._id}/${this.emailConfirmationCode}`

    // mail template
    const html = `
            <h3>Hi ,${this.fullName}</h3>
            <p>Welcome to our video chat app this your confirmation link : <br />
            <a href="${confirmationLink}">Click here to confirm your email</a>
            </p>
  `
    new sendMail().send(
        this.email,
        "Password confirmation",
        html,
        confirmationLink
    )
}

// search users
userSchema.statics.searchUsers = async function (user, query) {
    const users = await this.aggregate([
        {
            $match: {
                _id: { $ne: new mongoose.Types.ObjectId(user._id) },
                active: { $eq: true },
                $expr: {
                    $not: {
                        $in: [
                            new mongoose.Types.ObjectId(user._id),
                            "$blockedFriends",
                        ],
                    },
                },
            },
        },
        {
            $match: query,
        },
        {
            $addFields: {
                isBlocked: {
                    $cond: [
                        {
                            $in: [
                                "$_id",
                                user.blockedFriends.map(
                                    (i) => new mongoose.Types.ObjectId(i)
                                ),
                            ],
                        },
                        true,
                        false,
                    ],
                },
                isFriend: {
                    $cond: [
                        {
                            $in: [
                                "$_id",
                                user.friends.map(
                                    (i) => new mongoose.Types.ObjectId(i)
                                ),
                            ],
                        },
                        true,
                        false,
                    ],
                },
                isPending: {
                    $cond: [
                        {
                            $in: [user._id, "$pendingRequests"],
                        },
                        true,
                        false,
                    ],
                },
            },
        },
        {
            $project: {
                fullName: 1,
                isBlocked: 1,
                isPending: 1,
                isFriend: 1,
                profileImage: 1,
            },
        },
    ])
    return users
}

//block user
userSchema.statics.blockUser = async function (user, blockedUserId) {
    await this.findByIdAndUpdate(user._id, {
        $addToSet: {
            blockedFriends: new mongoose.Types.ObjectId(blockedUserId),
        },
    })
}

// unblock a user
userSchema.statics.unBlockUser = async function (user, blockedUserId) {
    await this.findByIdAndUpdate(user._id, {
        $pull: {
            blockedFriends: new mongoose.Types.ObjectId(blockedUserId),
        },
    })
}

// send Friend Request
userSchema.statics.sendFriendRequest = async function (user, userId) {
    const tempUser = await this.findOneAndUpdate(
        {
            _id: userId,
            friends: {
                $nin: [user._id],
            },
            pendingRequests: {
                $nin: [user._id],
            },
        },
        {
            $addToSet: {
                pendingRequests: user._id,
            },
        }
    )
    if (!tempUser) throw new appError("friend request not sended", 400)
}

// send Friend Request
userSchema.statics.cancelFriendRequest = async function (user, userId) {
    await this.findOneAndUpdate(
        {
            _id: userId,
            pendingRequests: {
                $in: [user._id],
            },
        },
        {
            $pull: {
                pendingRequests: user._id,
            },
        }
    )
}

// send Friend Request
userSchema.statics.acceptFriendRequest = async function (user, userId) {
    await this.findOneAndUpdate(
        {
            _id: user._id,
            pendingRequests: {
                $in: [new mongoose.Types.ObjectId(userId)],
            },
        },
        {
            $pull: {
                pendingRequests: new mongoose.Types.ObjectId(userId),
            },
            $addToSet: {
                friends: new mongoose.Types.ObjectId(userId),
            },
        }
    )
}

// send Friend Request
userSchema.statics.unfriend = async function (user, userId) {
    await this.findOneAndUpdate(
        {
            _id: user._id,
            friends: {
                $in: [new mongoose.Types.ObjectId(userId)],
            },
        },
        {
            $pull: {
                friends: new mongoose.Types.ObjectId(userId),
            },
        }
    )
}

// get friend requests
userSchema.statics.getFriendRequests = async function (user) {
    const users = await this.aggregate([
        {
            $match: {
                _id: user._id,
            },
        },
        {
            $unwind: {
                path: "$pendingRequests",
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "pendingRequests",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $project: {
                id: { $arrayElemAt: ["$user._id", 0] },
                fullName: { $arrayElemAt: ["$user.fullName", 0] },
                profileImage: { $arrayElemAt: ["$user.profileImage", 0] },
            },
        },
    ])
    return { users, count: user.pendingRequests.length }
}
module.exports = mongoose.model("User", userSchema)
