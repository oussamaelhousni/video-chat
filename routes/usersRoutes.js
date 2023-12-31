const router = require("express").Router()
const { usersController } = require("../controllers")

router.route("/").get(usersController.searchUsers)

module.exports = router
