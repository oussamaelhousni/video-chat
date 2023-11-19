const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "please provide a token"],
            unique: true,
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
)

const tokenModel = mongoose.model("Token", tokenSchema)
module.exports = tokenModel
