import TicketsModel from "../models/tickets.model.js"
import UserModel from "../models/users.model.js"
import CartsModel from "../models/carts.model.js"
import ProductModel from "../models/products.model.js"
import jwt from "jsonwebtoken"
import Config from "../../../config/config.js"
import { transport } from "../../../config/nodemailer.js"
import { __dirname } from "../../../utils.js"

export default class Tickets {
    constructor() { }

    getTickets = async (token, res) => {
        const userToken = jwt.verify(token, Config.COOKIE_KEY)
        const tickets = await TicketsModel.find({ "purchaser": userToken.email }).lean()
        return tickets
    }

    getTicketById = async (tid, res) => {
        const ticket = await TicketsModel.findById(tid)
        if (!ticket) {
            res.status(404).json({ message: "Not Found" })
        } else {
            res.status(200).json({ message: "success", ticket })
        }
    }

    createTicket = async (code, token, cid, res) => {
        const userToken = jwt.verify(token, Config.COOKIE_KEY)

        const user = await UserModel.findOne({ "email": userToken.email })
        const cart = await CartsModel.findById(cid)

        const price = []
        const ids = []
        const notProducts = []
        const products = []

        cart.products.map(async (prod) => {
            const product = prod.product
            const quantity = prod.quantity

            if (product.stock >= quantity) {
                price.push(product.price * quantity)
                products.push(prod)
                const newStock = product.stock - quantity
                product.stock = newStock
                await ProductModel.updateOne({ "code": product.code }, product)

            } else {

                let productId = product._id.toString()
                ids.push(productId)
                notProducts.push(prod)
            }
        })
        cart.products = notProducts
        cart.save()

        let total = price.reduce((acc, currentValue) => acc + currentValue, 0);

        if (products.length != 0) {
            const ticket = {
                code,
                amount: total,
                purchaser: user.email,
            }

            const newTicket = await TicketsModel.create(ticket)

            res.status(200).json({ message: "success", ticket: newTicket, ids })
        } else {
            res.status(400).json({ message: "Sin stock", ids })
        }

    }

    sendTicket = async (tid, user, res) => {
        const ticket = await TicketsModel.findOne({ code: tid })

        let result = await transport.sendMail({
            from: "Coder test",
            to: user.email,
            subject: "COMPRA CODER TEST",
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
                                    <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${user.firstName.toUpperCase()}!!</h1>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Tu compra se realizo correctamente, a continuacion veras los detalles.</p>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Orden n°: ${ticket.code}</p>
                                    <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">El total a pagar es de $ ${ticket.amount}</p>
                                    <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://localhost:${Config.PORT}/products" style="color:#ee4c50;text-decoration:underline;">Mirar mas productos!</a></p>
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

        res.status(200).json({ message: "email enviado!", result })

    }
}