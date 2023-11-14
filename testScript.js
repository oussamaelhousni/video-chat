const dotenv = require("dotenv")
const { sendMail } = require("./utils")
dotenv.config()

console.log(
    new sendMail().send("oussamaelhousni94@gmail.com", "hi", "uh", "jh")
)
