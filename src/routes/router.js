import { Router } from "express";
import jwt from "jsonwebtoken"
import { PRIVATE_KEY } from "../utils.js";

export default class Routes {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router
    }

    init() { }

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params)
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error)
            }
        })
    }

    /*
    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = payload => res.send({ status: "success", payload })
        res.sendServerError = error => res.status(500).send({ status: "error", error })
        res.sendUserError = error => res.status(400).send({ status: "error", error })
        next()
    }
    */

    handlePolicies = (policies) => async (req, res, next) => {
        if (policies[0] === "PUBLIC") return next()

        const token = req.cookies["coderCookieToken"];

        if (!token) {
            return res.render("401", { style: "error.css" })
            //return res.status(401).send({ error: "No autenticado" })
        }

        let user = jwt.verify(token, PRIVATE_KEY)

        if (!policies.includes(user.role.toUpperCase())) {
            return res.render("403", { style: "error.css" })
            //return res.status(403).send({ error: "No autorizado" })
        }
        req.user = user
        next()
    }

}