const { globalErrorHandler } = require("./errorController")
const conversationsController = require("./conversationsController")
const messagesController = require("./messagesController")

module.exports = {
    globalErrorHandler,
    conversationsController,
    messagesController,
}
