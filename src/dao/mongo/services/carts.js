import ProductModel from "../models/products.model.js"
import CartsModel from "../models/carts.model.js"
import UserModel from "../models/users.model.js"
import jwt from "jsonwebtoken"
import Config from "../../../config/config.js"
import CustomError from "../../../services/errors/CustomError.js";
import EErrors from "../../../services/errors/enums.js";
import { generateProductErrorInfo } from "../../../services/errors/info.js";

const adminArray = []
export default class Carts {
    constructor() { }

    getCarts = async (req, res) => {
        try {
            let carrito = await CartsModel.find()

            req.logger.info(`Se ha obtenido un listado de todos los carritos - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: `TODOS LOS CARRITOS`, carritos: carrito })
        }
        catch (error) {
            res.status(500).send(error)
        }

    }
    getCartById = async (cid, req, res) => {

        try {
            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                req.logger.error(`Error al obtener el carrito code ${cid}: No se ha encontrado un carrito con este code!`)
                res.status(404).json({ message: `Not Found` })

            } else {
                req.logger.info(`Se ha obtenido el carrito code ${cid} - DATE:${new Date().toLocaleTimeString()}`)
                res.status(200).json({ message: `CARRITO N° ${cid}`, products: carrito.products })

            }
        }

        catch (error) {
            res.status(500).send(error)
        }

    }
    addCart = async (token, req, res) => {

        try {

            const cart = new CartsModel()
            await cart.save()

            const userToken = jwt.verify(token, Config.COOKIE_KEY)

            /*
            if (userToken.email === Config.ADMIN_EMAIL) {
                const admin = {
                    email: userToken.email,
                    role: userToken.role,
                    cart: cart._id
                }
                adminArray.push(admin)
            } else {
                const user = await UserModel.findOne({ "email": userToken.email })
                user.cart = cart._id
                user.save()
            }
            */
            const user = await UserModel.findOne({ "email": userToken.email })
            user.cart = cart._id
            user.save()

            req.logger.info(`Se ha creado el carrito ID: ${cart._id} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: `CARRITO CREADO ID: ${cart._id}`, id: cart._id, user, cart })


        }
        catch (error) {
            res.status(500).send(error)
        }
    }
    addProductToCart = async (token, cid, pid, req, res) => {


        try {

            let carrito = await CartsModel.findOne({ _id: cid })

            let producto = await ProductModel.findOne({ _id: pid })

            const userToken = jwt.verify(token, Config.COOKIE_KEY)

            if (!userToken.admin) {

                if (producto.owner === userToken.email) {
                    req.logger.error(`Error al agregar un producto al carrito ${cid}: No puede agregar su mismo producto!`)
                    CustomError.createError({
                        name: "Error al agregar el producto",
                        cause: generateProductErrorInfo(product),
                        message: `No puede agregar su mismo producto`,
                        code: EErrors.INVALID_TYPES_ERROR
                    })
                }
            }

            if (carrito === null) {
                req.logger.error(`Error al agregar un producto al carrito ${cid}: No se ha encontrado un carrito con este code!`)
                return res.status(404).json({ error: "Cart Not Found" })

            } else if (carrito === null || producto === null) {
                req.logger.error(`Error al agregar el producto: ${pid} al carrito : No se ha encontrado un producto con este code!`)
                return res.status(404).json({ error: "Product Not Found" })

            }

            const productIndex = carrito.products.findIndex(e => e.product._id.equals(producto._id))

            if (productIndex === - 1) {
                carrito.products.push({ product: pid, quantity: 1 })
            } else {
                carrito.products[productIndex].quantity++
            }

            await CartsModel.updateOne({ _id: cid }, carrito)

            const actualizado = await CartsModel.findById(cid)

            req.logger.info(`Se ha agregado el producto: ${producto.title} al carrito CODE: ${cid} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: `Carrito actualizado`, data: actualizado })


        }
        catch (error) {
            res.status(500).send(error)
        }
    }
    deleteCart = async (cid, req, res) => {

        try {
            const cart = await CartsModel.deleteOne({ _id: cid })

            if (cart.deletedCount) {
                req.logger.info(`Se ha eliminado el carrito ID: ${cid} - DATE:${new Date().toLocaleTimeString()}`)
                res.status(200).json({ message: `CARRITO N° ${cid} ELIMINADO`, status: "success" })

            } else {
                req.logger.error(`Error al eliminar el carrito ID: ${cid} : No se ha encontrado un carrito con este ID!`)
                res.status(404).json({ message: `Not Found` })
            }
        }

        catch (error) {
            res.status(500).send(error)
        }

    }
    deleteAllProductsFromCart = async (cid, req, res) => {

        try {
            const carrito = await CartsModel.updateOne({ _id: cid }, { products: [] })

            if (carrito.matchedCount === 0) {
                req.logger.error(`Error al eliminar los productos del carrito ID: ${cid} : No se ha encontrado un carrito con este ID!`)
                res.status(404).json({ message: `Not Found` })

            } else {
                req.logger.info(`Se han eliminado los productos del carrito ID: ${cid} - DATE:${new Date().toLocaleTimeString()}`)
                res.status(200).json({ message: `CARRITO N° ${cid} VACIO` })

            }
        }

        catch (error) {
            res.status(500).send(error)
        }

    }
    deleteProductsFromCart = async (cid, pid, req, res) => {

        try {
            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                req.logger.error(`Error al eliminar el producto ID ${pid} del darrito: ${cid} : No se ha encontrado un carrito con este ID!`)
                return res.status(404).json({ error: "Not Found" })

            }
            const productIndex = carrito.products.findIndex((e) => e.product._id.equals(pid))

            if (productIndex === -1) {
                req.logger.error(`Error al eliminar el producto ID ${pid} del darrito: ${cid} : No se ha encontrado un producto con este ID!`)
                return res.status(404).json({ error: "Not Found" })

            }

            carrito.products.splice(productIndex, 1)

            await CartsModel.updateOne({ _id: cid }, carrito, { new: true })

            req.logger.info(`Se ha eliminado el producto ID: ${pid} del carrito ID: ${cid} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: `PRODUCTO ID: ${pid} ELIMINADO DEL CARRITO`, data: carrito })

        }

        catch (error) {
            res.status(500).send(error)
        }

    }
    updateQuantity = async (cid, pid, quantity, req, res) => {

        try {

            const carrito = await CartsModel.findById(cid)

            if (carrito === null) {
                req.logger.error(`Error al actualizar la cantidad : No se ha encontrado un carrito con el ID ${cid} !`)
                return res.status(404).json({ error: "Cart Not Found" })

            }

            const productIndex = carrito.products.findIndex((e) => e.product._id.equals(pid))

            if (productIndex === -1) {
                req.logger.error(`Error al actualizar la cantidad del producto: ${pid} : No se ha encontrado un producto con este ID!`)
                return res.status(404).json({ error: "Product Not Found" })

            }

            carrito.products[productIndex].quantity += Number(quantity)

            const actualizado = await CartsModel.updateOne({ _id: cid }, carrito)

            req.logger.info(`Se ha actualizado la cantidad del producto ID: ${pid} en el carrito ID: ${cid} - DATE:${new Date().toLocaleTimeString()}`)

            res.status(200).json({ message: `CANTIDAD ACTUALIZADA : ${quantity}`, data: actualizado })

        }

        catch (error) {
            res.status(500).send(error)
        }

    }
    getCartByIdView = async (cid, req, res) => {

        try {
            const carrito = await CartsModel.findById(cid)

            if (!carrito) {
                req.logger.error(`Error al obtener el carrito: ${cid} (VIEW) : No se ha encontrado un carrito con este ID!`)
                res.status(404).json({ message: "Not Found" })
            }

            const products = carrito.products.map((e) => ({
                product: {
                    _id: e.product._id,
                    title: e.product.title,
                    description: e.product.description,
                    code: e.product.code,
                    price: e.product.price,
                    stock: e.product.stock,
                    category: e.product.category,
                    status: e.product.status,
                    thumbnails: e.product.thumbnails
                },
                quantity: e.quantity
            }))

            let status = true

            if (products.length <= 0) {
                status = false
            }

            const resolve = {
                status,
                _id: carrito._id,
                products
            }

            req.logger.info(`Se ha obtenido el carrito ID: ${cid} (VIEW) - DATE:${new Date().toLocaleTimeString()}`)

            return resolve

        }
        catch (error) {
            res.status(500).send(error)
        }
    }

    getUserCart = async (token, req, res) => {
        try {
            let user
            const userToken = jwt.verify(token, Config.COOKIE_KEY)
            if (userToken.email === Config.ADMIN_EMAIL) {
                user = adminArray[0]
            } else {
                user = await UserModel.findOne({ "email": userToken.email })
            }

            if (!user.cart) {
                req.logger.error(`Error al obtener el carrito del usuario : ${userToken.email} : No se ha encontrado el usuario!`)
                res.status(404).json({ message: `Not Found` })

            } else {
                const carrito = await CartsModel.findOne({ "_id": user.cart._id })

                if (carrito === null) {
                    req.logger.error(`Error al obtener el carrito ID: ${user.cart._id} del usuario: ${user.email} : No se ha encontrado un carrito con este ID!`)
                    res.status(404).json({ message: `Not Found` })

                } else {
                    req.logger.info(`Se ha obtenido el carrito ID: ${carrito._id} (VIEW) - DATE:${new Date().toLocaleTimeString()}`)

                    res.status(200).json({ cartId: carrito._id, carrito, user })

                }
            }

        }

        catch (error) {
            console.log(error);
            req.logger.fatal("FATAL ERROR")
            res.status(500).send(error)
        }

    }

    purchase = async (token, cid, req, res) => {
        try {
            const userToken = jwt.verify(token, Config.COOKIE_KEY)
            const user = await UserModel.findOne({ "email": userToken.email })
            const cart = await CartsModel.findById(cid)

            cart.products.map(async (prod) => {
                const product = prod.product
                const quantity = prod.quantity

                if (product.stock >= quantity) {
                    const newStock = product.stock - quantity
                    product.stock = newStock
                    await ProductModel.updateOne({ "code": product.code }, product)
                    req.logger.info(`El usuario: ${user.email} ha completado la compra - carrito ID: ${cid} - DATE:${new Date().toLocaleTimeString()}`)

                } else {
                    req.logger.error(`Error al realizar la compra : No hay stock para el producto: ${product.title}!`)
                    res.status(404).json({ message: `Sin stock` })

                }
            })
        }

        catch (error) {
            res.status(500).send(error)
        }

    }

}


