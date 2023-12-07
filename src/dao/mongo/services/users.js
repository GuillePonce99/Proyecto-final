import UserModel from "../models/users.model.js";
import { userDTO } from "../../DTOs/session.dto.js";
import moment from "moment/moment.js";
import { transport } from "../../../config/nodemailer.js";

export default class Products {
    constructor() { }
    getUsers = async (req, res) => {
        try {
            const users = []
            const usersDB = await UserModel.find()

            if (!usersDB) {
                req.logger.error(`Error al obtener los usuarios: No se encontro en la base de datos!`)
                return res.status(404).json({ message: "Not Found" });
            }
            usersDB.map((user) => {
                users.push(new userDTO(user))
            })
            req.logger.info(`Se ha obtenido todos los usuarios - DATE:${new Date().toLocaleTimeString()}`)
            return users
        }
        catch (error) {
            res.status(500).send(error)
        }

    }
    deleteInactiveUser = async (req, res) => {
        try {

            const users = await UserModel.find()

            users.map(async (user) => {
                const last_connection = moment(user.last_connection)
                const diferencia = last_connection.diff(moment(), "days")

                if (diferencia <= -2) {
                    await UserModel.findByIdAndDelete(user._id)
                    req.logger.info(`Se ha eliminado el usuario por inactividad: ${user.email} - DATE:${new Date().toLocaleTimeString()}`)

                    await transport.sendMail({
                        from: "Ecommerce Test",
                        to: user.email,
                        subject: "Cuenta eliminada",
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
                                                <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">${user.email.toUpperCase()}</h1>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Su cuenta ha sido eliminada por permanecer demasiado tiempo inactiva!</p>
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
            })

            res.status(200).json({ message: "success" })
        }
        catch (error) {
            res.status(500).send(error)
        }
    }

    changeRole = async (req, res) => {
        const { email, newRole } = req.params
        const user = await UserModel.findOne({ email })

        user.role = newRole
        await user.save()

        req.logger.info(`El usuario ${user.email} ahora es ${newRole} - DATE:${new Date().toLocaleTimeString()}`)

        res.status(200).json({ message: "success", user })
    }


    deleteUser = async (req, res) => {
        const { email } = req.params
        const user = await UserModel.findOne({ email })
        if (!user) {
            req.logger.error(`Error al eliminar un usuario : No se encuentra en la base de datos!`)
            return res.status(401).json({ error: "El usuario no existe!" })
        } else {
            await UserModel.findOneAndDelete({ email })
            req.logger.warning(`El usuario ${user.email} ha sido eliminado! - DATE:${new Date().toLocaleTimeString()}`)
            return res.status(200).json({ message: "success", email: user.email })
        }
    }


}
