import dotenv from "dotenv"
import { options } from "./commander.js";

const environment = options.environment
let pathEnv
switch (environment) {
    case "DEV":
        pathEnv = "./.env.dev"
        break
    case "PROD":
        pathEnv = "./.env.prod"
        break
    case "PRODUCTION":
        pathEnv = "./.env.prod"
        break
}
dotenv.config({
    path: pathEnv
})

export default {
    MAILER_SERVICE: process.env.MAILER_SERVICE,
    MAILER_USER: process.env.MAILER_USER,
    MAILER_PASSWORD: process.env.MAILER_PASSWORD,
    PORT: options.port || process.env.PORT,
    MONGO_DB: process.env.MONGO_DB,
    MONGO_URI: process.env.MONGO_URI,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
    COOKIE_KEY: process.env.COOKIE_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    PERSISTENCE: options.persistence,
    ENVIRONMENT: environment
}

