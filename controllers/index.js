const { globalErrorHandler } = require("./errorController")
const conversationsController = require("./conversationsController")
const messagesController = require("./messagesController")
const usersController = require("./usersController")
module.exports = {
    globalErrorHandler,
    conversationsController,
    messagesController,
    usersController,
}
