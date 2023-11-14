const jwt = require("jsonwebtoken")

const { promisify } = require("node:util")

const createJwt = async (userId) => {
    const promiseJwtSign = promisify(jwt.sign)

    return {
        access: await promiseJwtSign(
            { id: userId },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRESIN,
            }
        ),
        refresh: await promiseJwtSign(
            { id: userId },
            process.env.JWT_REFRESH_TOKEN,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRESIN,
            }
        ),
    }
}

module.exports = createJwt
