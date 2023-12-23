const mongoose = require("mongoose")

const storyModel = new mongoose.Schema({
    type: {
        type: String,
        enum: ["video", "text", "image"],
        default: "text",
    },
})
