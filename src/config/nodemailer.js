import nodemailer from "nodemailer"
import Config from "./config.js"

export const transport = nodemailer.createTransport({
    service: Config.MAILER_SERVICE,
    port: 587,
    auth: {
        user: Config.MAILER_USER,
        pass: Config.MAILER_PASSWORD
    }
})