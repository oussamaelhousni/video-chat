const nodemailer = require("nodemailer")

class sendMail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        })
        return this
    }
    async send(email, subject, html, text) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject,
                text,
                html,
            })
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = sendMail
