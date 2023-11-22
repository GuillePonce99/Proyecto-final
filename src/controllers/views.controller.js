import { getProductsView } from "./product.controller.js"
import { getCartByIdView } from "./carts.controller.js"
import { getTickets } from "./tickets.controller.js"
import { usersServices } from "../repositories/index.js"
import { PRIVATE_KEY } from "../utils.js"
import jwt from "jsonwebtoken"
import { da } from "@faker-js/faker"

export class viewsController {

    static home = async (req, res) => {

        res.render("home", { style: "styles.css", title: "PRODUCTOS" })
    }

    static chat = async (req, res) => {
        res.render("chat", { style: "chat.css", title: "CHAT", user: req.user })
    }

    static products = async (req, res) => {
        const data = await getProductsView(req, res)
        res.render("products", { style: "styles.css", title: "PRODUCTOS", data })
    }

    static carts = async (req, res) => {
        const data = await getCartByIdView(req, res)
        res.render("carts", { style: "styles.css", title: "CARRITO", data })
    }

    static signup = async (req, res) => {
        res.render("signup", { style: "login.css" })
    }

    static login = async (req, res) => {
        res.render("login", { style: "login.css" })
    }

    static forgot = async (req, res) => {
        res.render("forgot", { style: "login.css" })
    }

    static newPassword = async (req, res) => {
        const { user, token } = req.params

        jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
            if (error) {
                return res.render("401", { style: "error.css" })
            }
            req.user = credentials.user;
            res.render("newPassword", { style: "login.css", user })
        })
    }

    static tickets = async (req, res) => {
        const data = await getTickets(req, res)
        res.render("tickets", { style: "styles.css", data })
    }

    static usersManager = async (req, res) => {
        const data = await usersServices.getUsers(req, res)
        res.render("usersManager", { style: "styles.css", data })
    }

}



