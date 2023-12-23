const { appError } = require("../utils")

const handleDuplicateValues = (err) => {
    if (
        Object.keys(err.keyPattern).join("").includes("userOne") ||
        Object.keys(err.keyPattern).join("").includes("userTwo")
    )
        return new appError(`Conversation already exists`, 400)
    return new appError(`${Object.keys(err.keyValue)[0]} already exists`, 400)
}

const handleValidationError = (error) => {
    const firstKeyError = Object.keys(error.errors)[0]
    return new appError(error.errors[firstKeyError].message, 400)
}

const sendErrorDev = (res, error) => {
    return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error: error,
    })
}

const sendErrorProd = (res, error) => {
    let err = { ...error, name: error.name, message: error.message }
    if (err.code === 11000) {
        err = handleDuplicateValues(error)
    }

    if (err.name == "ValidationError") {
        err = handleValidationError(err)
    }
    if (err.isOperational) {
        console.log("hello")
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    return res.status(500).json({
        status: "error",
        message: "Something went wrong",
    })
}

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    return process.env.NODE_ENV === "development"
        ? sendErrorDev(res, error)
        : sendErrorProd(res, error)
}

module.exports = { globalErrorHandler }
