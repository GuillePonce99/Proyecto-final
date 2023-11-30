import ProductModel from "../models/products.model.js";
import UserModel from "../models/users.model.js";
import jwt from "jsonwebtoken"
import Config from "../../../config/config.js";
import { transport } from "../../../config/nodemailer.js";


export default class Products {
    constructor() { }
    getProductById = async (pid, req, res) => {
        try {
            const product = await ProductModel.findOne({ code: pid })
            if (!product) {
                req.logger.error(`Error al obtener el producto code ${pid}: No se encontro en la base de datos!`)
                return res.status(404).json({ error: "Not Found" });
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
            return res.status(401).json({ error: "Faltan datos!" })
        }

        if (id) {
            req.logger.error(`Error al agregar el producto: no debe incluir ID!`)
            return res.status(401).json({ error: "No incluir ID" });
        }

        const repetedCode = await ProductModel.findOne({ "code": code })

        if (repetedCode) {
            req.logger.error(`Error al agregar el producto: ya existe el producto con el code: ${code}`)
            return res.status(404).json({ error: `Ya existe el producto con el CODE: ${code}` });
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
            //producto a eliminar
            const product = await ProductModel.findOne({ code: pid })

            //filtro por si el producto no existe
            if (!product) {
                req.logger.error(`Error al eliminar el producto code ${pid}: No se encontro en la base de datos!`)
                return res.status(404).json({ error: "Not Found" });
            }

            //token para saber quien esta eliminando este producto si un admin o un user_premium
            const token = req.cookies["coderCookieToken"];
            const userToken = jwt.verify(token, Config.COOKIE_KEY)
            let result

            //caso en el que un admin elimine un producto propio o de un usuario
            if (userToken.admin) {
                const owner = await UserModel.findOne({ email: product.owner })
                //filtro por si el dueño del producto es un admin (default) (no mandar email)
                if (owner === null) {
                    result = await ProductModel.findOneAndDelete({ code: pid })
                } else if (owner.role === "user_premium") { //filtro por si el dueño del producto es un usuario premium (mandar email)
                    await transport.sendMail({
                        from: "Ecommerce Test",
                        to: "guille.13577@gmail.com",
                        subject: "Producto eliminado",
                        html:
                            `
                        <!DOCTYPE html>
                        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width,initial-scale=1">
                        <meta name="x-apple-disable-message-reformatting">
                        <title></title>
                        <!--[if mso]>
                        <noscript>
                            <xml>
                            <o:OfficeDocumentSettings>
                                <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                            </xml>
                        </noscript>
                        <![endif]-->
                        <style>
                            table, td, div, h1, p {font-family: Arial, sans-serif;}
                        </style>
                        </head>
                        <body style="margin:0;padding:0;">
                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                            <tr>
                            <td align="center" style="padding:0;">
                                <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                                <tr>
                                    <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                                    <img src="https://assets.codepen.io/210284/h1.png" alt="" width="300" style="height:auto;display:block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:36px 30px 42px 30px;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                        <tr>
                                        <td style="padding:0 0 36px 0;color:#153643;">
                                            <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${owner.firstName.toUpperCase()}</h1>
                                            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">El producto ${product.title} ha sido eliminado del catalogo!</p>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td style="padding:0;">
                                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                            <tr>
                                                <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                                <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/left.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, est nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>
                                                <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">Blandit ipsum volutpat sed</a></p>
                                                </td>
                                                <td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
                                                <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                                <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/right.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Morbi porttitor, eget est accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed.</p>
                                                <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">In tempus felis blandit</a></p>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:30px;background:#ee4c50;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                        <tr>
                                        <td style="padding:0;width:50%;" align="left">
                                            <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                            &reg; Someone, Somewhere 2021<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a>
                                            </p>
                                        </td>
                                        <td style="padding:0;width:50%;" align="right">
                                            <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                            <tr>
                                                <td style="padding:0 0 0 10px;width:38px;">
                                                <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                                </td>
                                                <td style="padding:0 0 0 10px;width:38px;">
                                                <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </body>
                        </html>
                    `,
                        attachments: []
                    })
                    result = await ProductModel.findOneAndDelete({ code: pid })
                } else { //filtro por si el dueño del producto es un usuario comun (no mandar email)
                    result = await ProductModel.findOneAndDelete({ code: pid })
                }

            } else {

                //caso en el que un usuario premium este eliminando un producto
                const user = await UserModel.findOne({ email: userToken.email })
                //filtro para que solo pueda eliminar sus propios productos
                if (product.owner !== user.email) {
                    req.logger.error(`Error al eliminar el producto code ${pid}: No tiene permisos!`)
                    return res.status(401).json({ error: "Not Authorized" })
                }

                if (user.role === "user_premium") {
                    await transport.sendMail({
                        from: "Ecommerce Test",
                        to: "guille.13577@gmail.com",
                        subject: "Producto eliminado",
                        html:
                            `
                            <!DOCTYPE html>
                            <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
                            <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width,initial-scale=1">
                            <meta name="x-apple-disable-message-reformatting">
                            <title></title>
                            <!--[if mso]>
                            <noscript>
                                <xml>
                                <o:OfficeDocumentSettings>
                                    <o:PixelsPerInch>96</o:PixelsPerInch>
                                </o:OfficeDocumentSettings>
                                </xml>
                            </noscript>
                            <![endif]-->
                            <style>
                                table, td, div, h1, p {font-family: Arial, sans-serif;}
                            </style>
                            </head>
                            <body style="margin:0;padding:0;">
                            <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
                                <tr>
                                <td align="center" style="padding:0;">
                                    <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                                    <tr>
                                        <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                                        <img src="https://assets.codepen.io/210284/h1.png" alt="" width="300" style="height:auto;display:block;" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:36px 30px 42px 30px;">
                                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                            <tr>
                                            <td style="padding:0 0 36px 0;color:#153643;">
                                                <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${user.firstName.toUpperCase()}</h1>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">El producto ${product.title} ha sido eliminado del catalogo!</p>
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="padding:0;">
                                                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                                <tr>
                                                    <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                                    <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/left.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, eget accumsan dictum, est nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>
                                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">Blandit ipsum volutpat sed</a></p>
                                                    </td>
                                                    <td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
                                                    <td style="width:260px;padding:0;vertical-align:top;color:#153643;">
                                                    <p style="margin:0 0 25px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><img src="https://assets.codepen.io/210284/right.gif" alt="" width="260" style="height:auto;display:block;" /></p>
                                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Morbi porttitor, eget est accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed.</p>
                                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://www.example.com" style="color:#ee4c50;text-decoration:underline;">In tempus felis blandit</a></p>
                                                    </td>
                                                </tr>
                                                </table>
                                            </td>
                                            </tr>
                                        </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:30px;background:#ee4c50;">
                                        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                            <tr>
                                            <td style="padding:0;width:50%;" align="left">
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                                                &reg; Someone, Somewhere 2021<br/><a href="http://www.example.com" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a>
                                                </p>
                                            </td>
                                            <td style="padding:0;width:50%;" align="right">
                                                <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                                <tr>
                                                    <td style="padding:0 0 0 10px;width:38px;">
                                                    <a href="http://www.twitter.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                                    </td>
                                                    <td style="padding:0 0 0 10px;width:38px;">
                                                    <a href="http://www.facebook.com/" style="color:#ffffff;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                                    </td>
                                                </tr>
                                                </table>
                                            </td>
                                            </tr>
                                        </table>
                                        </td>
                                    </tr>
                                    </table>
                                </td>
                                </tr>
                            </table>
                            </body>
                            </html>
                        `,
                        attachments: []
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
                return res.status(404).json({ error: "Not Found" });
            }

            const repetedCode = await ProductModel.findOne({ "code": body.code })

            if (repetedCode) {
                req.logger.error(`Error al actualizar el producto code ${pid}: Ya existe un producto con este code!`)
                return res.status(404).json({ error: `Ya existe el producto con el CODE: ${body.code}` });
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
