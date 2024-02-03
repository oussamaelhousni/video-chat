const { appError } = require("../utils")
const multer = require("multer")
const uuid = require("uuid").v4
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const mimeType = file.mimetype
        if (mimeType.startsWith("image")) {
            req.body.type = "image"
            return cb(null, `${__dirname}/../public/images`)
        } else if (mimeType.startsWith("video")) {
            req.body.type = "video"
            return cb(null, `${__dirname}/../public/videos`)
        } else if (mimeType.startsWith("audio")) {
            return cb(null, `${__dirname}/../public/audios`)
        }
    },

    filename: function (req, file, cb) {
        cb(null, `${uuid()}${path.extname(file.originalname)}`)
    },
})

const fileFilter = function (req, file, cb) {
    if (
        file.mimetype.startsWith("image") ||
        file.mimetype.startsWith("video") ||
        file.mimetype.startsWith("audio")
    ) {
        return cb(null, true)
    }
    cb(new appError("Only audios and videos and images are  allowed", 400))
}

const upload = multer({ storage: storage, fileFilter })

module.exports = upload
