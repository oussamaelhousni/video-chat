const router = require("express").Router()
const { usersController } = require("../controllers")

router.route("/").get(usersController.searchUsers)
router.route("/block").post(usersController.blockUser)
router.route("/unblock").post(usersController.unBlockUser)
router.route("/sendFriendRequest").post(usersController.sendFriendRequest)
router.route("/cancelFriendRequest").post(usersController.cancelFriendRequest)
router
    .route("/acceptFriendRequest/:userId")
    .post(usersController.acceptFriendRequest)
router.route("/unfriend/:userId").post(usersController.unfriend)

module.exports = router
