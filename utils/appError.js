class appError extends Error {
    constructor(message = "Something went wrong", statusCode = 500) {
        super(message)
        this.statusCode = statusCode
        this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error"
        this.isOperational = true
    }
}

module.exports = appError
