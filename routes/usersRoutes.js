const router = require("express").Router()
const { usersController } = require("../controllers")
const { protect } = require("../middlewares")

router.route("/friendRequests").get(protect, usersController.getFriendRequests)
router.route("/").get(protect, usersController.searchUsers)
router.route("/block").post(protect, usersController.blockUser)
router.route("/unblock").post(protect, usersController.unBlockUser)
router
    .route("/sendFriendRequest")
    .post(protect, usersController.sendFriendRequest)
router
    .route("/cancelFriendRequest")
    .post(protect, usersController.cancelFriendRequest)
router
    .route("/acceptFriendRequest/:userId")
    .post(protect, usersController.acceptFriendRequest)

router.route("/unfriend/:userId").post(protect, usersController.unfriend)

module.exports = router
