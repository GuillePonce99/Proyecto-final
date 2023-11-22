import ProductModel from "../models/products.model.js";
import CustomError from "../../../services/errors/CustomError.js";
import EErrors from "../../../services/errors/enums.js";
import { generateProductErrorInfo } from "../../../services/errors/info.js";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken"
import Config from "../../../config/config.js";


export default class Products {
    constructor() { }
    getProductById = async (pid, req, res) => {
        console.log(pid);
        try {
            const product = await ProductModel.findOne({ code: pid })
            if (!product) {
                req.logger.error(`Error al obtener el producto code ${pid}: No se encontro en la base de datos!`)
                return res.status(404).json({ message: "Not Found" });
            }
            const result = await ProductModel.findOne({ code: pid });
            req.logger.info(`Se ha obtenido el producto ${result.title} - DATE:${new Date().toLocaleTimeString()}`)
            res.status(200).json({ message: "success", result })
        }
        catch (error) {
            res.status(500).send(error)
        }

    }
    addProduct = async (product, req, res) => {

        const { id, title, description, code, price, stock, status, category, thumbnails } = product

        if (!title || !description || !code || !price || !category) {
            req.logger.error(`Error al agregar el producto: faltan datos!`)
            CustomError.createError({
                name: "Error al agregar el producto",
                cause: generateProductErrorInfo(product),
                message: "Faltan datos!",
                code: EErrors.INVALID_TYPES_ERROR
            })

        }

        if (id) {
            req.logger.error(`Error al agregar el producto: no debe incluir ID!`)
            return res.status(401).json({ message: "No incluir ID" });
        }

        const repetedCode = await ProductModel.findOne({ "code": code })

        if (repetedCode) {
            req.logger.error(`Error al agregar el producto: ya existe el producto con el code: ${code}`)
            CustomError.createError({
                name: "Error al agregar el producto",
                cause: generateProductErrorInfo(product),
                message: `Ya existe el producto con el CODE: ${code}`,
                code: EErrors.INVALID_TYPES_ERROR
            })
            //return res.status(404).json({ message: `Ya existe el producto con el CODE: ${code}` });
        }

        const token = req.cookies["coderCookieToken"];
        const userToken = jwt.verify(token, Config.COOKIE_KEY)
        let user
        if (userToken.admin) {
            user = userToken
        } else {
            user = await UserModel.findOne({ email: userToken.email })
        }

        try {

            const product = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails,
                owner: user.role === "user_premium" ? user.email : "admin"
            }

            const result = await ProductModel.create(product)

            req.logger.info(`Se ha agregado el producto ${result.title} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: "success", result })
        }
        catch (error) {
            res.status(500).send(error)
        }
    }
    deleteProduct = async (pid, req, res) => {

        try {
            const product = await ProductModel.findOne({ code: pid })

            if (!product) {
                req.logger.error(`Error al eliminar el producto code ${pid}: No se encontro en la base de datos!`)
                CustomError.createError({
                    name: "Error al eliminar el producto",
                    cause: generateProductErrorInfo(product),
                    message: "Not Found",
                    code: EErrors.DATABASE_ERROR
                })
                //return res.status(404).json({ message: "Not Found" });
            }

            const token = req.cookies["coderCookieToken"];
            const userToken = jwt.verify(token, Config.COOKIE_KEY)
            let result

            if (userToken.admin) {
                result = await ProductModel.findOneAndDelete({ code: pid })
            } else {

                const user = await UserModel.findOne({ email: userToken.email })
                if (product.owner !== user.email) {
                    req.logger.error(`Error al eliminar el producto code ${pid}: No tiene permisos!`)
                    CustomError.createError({
                        name: "Not Authorized",
                        cause: generateProductErrorInfo(product),
                        message: "Not Authorized",
                        code: EErrors.DATABASE_ERROR
                    })
                }
                result = await ProductModel.findOneAndDelete({ code: pid })
            }

            req.logger.info(`Se ha eliminado el producto ${result.title} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: "success", result })
        }
        catch (error) {
            res.status(500).send(error)
        }
    }
    updateProduct = async (pid, req, res) => {
        let body = req.body

        try {
            const product = await ProductModel.findOne({ code: pid })

            if (!product) {
                req.logger.error(`Error al actualizar el producto code: ${pid}: No se encontro en la base de datos!`)
                CustomError.createError({
                    name: "Error al actualizar el producto",
                    cause: generateProductErrorInfo(product),
                    message: "Not Found",
                    code: EErrors.DATABASE_ERROR
                })
                //return res.status(404).json({ message: "Not Found" });
            }

            const repetedCode = await ProductModel.findOne({ "code": body.code })

            if (repetedCode) {
                req.logger.error(`Error al actualizar el producto code ${pid}: Ya existe un producto con este code!`)
                CustomError.createError({
                    name: "Error al actualizar el producto",
                    cause: generateProductErrorInfo(product),
                    message: `Ya existe el producto con el CODE: ${body.code}`,
                    code: EErrors.INVALID_TYPES_ERROR
                })
                //return res.status(404).json({ message: `Ya existe el producto con el CODE: ${body.code}` });
            }

            const actualizado = await ProductModel.findOneAndUpdate({ code: pid }, body, { new: true })

            req.logger.info(`Se ha actualizado el producto ${actualizado.title} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: "success", result: actualizado })

        }
        catch (error) {
            res.status(500).send(error)
        }
    }

    getProducts = async (limit, page, query, req, res) => {

        try {
            const options = {
                limit,
                page
            }

            const filter = query ? query === "0" ? { stock: 0 } : { category: query } : {}

            let result = await ProductModel.paginate(filter, options)

            let status = result ? "success" : "error"

            let queryFormated = query ? req.query.query.replace(/ /g, "%20") : ""

            let response = {
                status,
                totalPages: result.totalPages,
                count: result.totalDocs,
                prevLink: result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}${query ? `&query=${queryFormated}` : ""}` : null,
                payload: result.docs

            }

            req.logger.info(`Se ha obtenido un listado de todos los productos - DATE:${new Date().toLocaleTimeString()}`)
            res.status(200).json({ message: "success", response })

        }
        catch (error) {
            res.status(500).send(error)
        }
    }

    getProductsView = async (limit, page, sort, query, req, res) => {

        try {
            const options = {
                limit,
                page,
                sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : undefined
            }

            const filter = query ? query === "0" ? { stock: 0 } : { category: query } : {}

            let result = await ProductModel.paginate(filter, options)

            const product = result.docs.map((e) => {
                return {
                    _id: e._id,
                    title: e.title,
                    description: e.description,
                    code: e.code,
                    price: e.price,
                    status: e.status,
                    stock: e.stock,
                    category: e.category,
                    thumbnails: e.thumbnails,
                    owner: e.owner
                }
            })

            let status = result ? "success" : "error"

            let queryFormated = query ? req.query.query.replace(/ /g, "%20") : ""

            let isAdmin = false
            let isPremium = false
            let hadPermissions = false
            let user

            if (req.user.admin) {
                isAdmin = true
                hadPermissions = true
                user = req.user
            } else {
                user = await UserModel.findOne({ email: req.user.email }).lean()
                if (user.role === "user_premium") {
                    isPremium = true
                    hadPermissions = true
                }
            }

            let response = {
                status,
                payload: { product, user, isAdmin, isPremium, hadPermissions },
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null,
                nextLink: result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}&sort=${req.query.sort}${query ? `&query=${queryFormated}` : ""}` : null
            }

            req.logger.info(`Se ha obtenido un listado de todos los productos - DATE:${new Date().toLocaleTimeString()}`)
            return response
        }
        catch (error) {
            res.status(500).send(error)
        }
    }

}
