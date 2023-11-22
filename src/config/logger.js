import winston from "winston"
import Config from "./config.js"

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "bold underline black",
        error: "bold underline red",
        warning: "underline yellow",
        info: "italic blue",
        http: "italic green",
        debug: "italic white"
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "errors.log",
            level: "error",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )

        })
    ]
})

/*
export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "error"
        })
    ]
})
*/

export let logger
if (Config.ENVIRONMENT === "PRODUCTION" || Config.ENVIRONMENT === "PROD") {
    logger = prodLogger
} else {
    logger = devLogger
}

export const addLoger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`${req.method} ${req.url} - DATE: ${new Date().toLocaleTimeString()} - STATUS: ${res.statusCode}`)
    next()
}