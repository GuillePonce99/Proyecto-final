import UserModel from "../models/users.model.js"
import { createHash, generateToken, isValidPassword } from "../../../utils.js"
import Config from "../../../config/config.js"
import { signupDTO, userDTO } from "../../DTOs/session.dto.js"
import { transport } from "../../../config/nodemailer.js"

export default class Sessions {
  constructor() { }
  login = async (req, res) => {
    const { email, password } = req.body
    try {
      if (email === Config.ADMIN_EMAIL && password === Config.ADMIN_PASSWORD) {
        const token = generateToken({
          email,
          role: "admin",
          admin: true
        })

        req.logger.info(`ADMIN ha iniciado sesion - DATE:${new Date().toLocaleTimeString()}`)

        res.cookie("coderCookieToken", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true
        }).status(200).json({ message: "success" })

      } else if (email === Config.ADMIN_EMAIL && password !== Config.ADMIN_PASSWORD) {
        req.logger.error(`Error al iniciar sesion (ADMIN) : La contraseña es incorrecta!`)
        return res.status(401).json({ error: "Contraseña incorrecta!" })

      } else {

        const user = await UserModel.findOne({ email })
        if (user === null) {
          req.logger.error(`Error al iniciar sesion: El email es incorrecta!`)
          return res.status(401).json({ error: "Email incorrecto!" })
        } else if (!isValidPassword(password, user)) {
          req.logger.error(`Error al iniciar sesion: La contraseña es incorrecta!`)
          return res.status(401).json({ error: "Contraseña incorrecta!" })
        }

        await UserModel.findOneAndUpdate({ email }, { last_connection: Date.now() });

        const token = generateToken({
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          role: user.role,
          admin: false
        })

        req.logger.info(`El usuario ${email} ha iniciado sesion - DATE:${new Date().toLocaleTimeString()}`)

        res.cookie("coderCookieToken", token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true
        }).status(200).json({ message: "success" })
      }

    } catch (error) {
      console.log(error);
      res.status(500).send(error)
    }

  }

  loginGitHub = async (req, res) => {
    const user = req.user
    try {
      let token = generateToken({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        role: "user"
      })

      req.logger.info(`El usuario ${user.email} ha iniciado sesion mediante GitHub - DATE:${new Date().toLocaleTimeString()}`)

      res.cookie("coderCookieToken", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
      }).redirect("/products")

    } catch (error) {
      res.status(500).send(error)
    }

  }

  signup = async (req, res) => {
    let user = new signupDTO(req.body)
    try {

      const repetedEmail = await UserModel.findOne({ email: user.email })

      if (repetedEmail) {
        req.logger.error(`Error al crear un usuario : El email ${user.email} ya se encuentra en uso!`)
        return res.status(401).json({ error: "El email ingresado ya existe!" })
      }

      if (user.age <= 0 || user.age >= 100) {
        req.logger.error(`Error al crear un usuario : La edad ingresada no es correcta!`)
        return res.status(401).json({ error: "Ingrese una edad correcta!" })
      }

      user.password = createHash(user.password)
      user = { ...user, role: "user" }

      const result = await UserModel.create(user)

      req.logger.info(`Se ha creado un nuevo usuario : ${result.email} - DATE:${new Date().toLocaleTimeString()}`)

      res.send({ result })

    }
    catch (error) {
      console.log(error);
      res.status(500).send(error)
    }

  }

  forgot = async (req, res) => {
    const { email } = req.body
    try {
      const user = await UserModel.findOne({ email })

      if (!user) {
        req.logger.error(`Error al cambiar la contraseña : El email ${email} no se ha encontrado!`)
        return res.status(401).json({ error: "Email incorrecto!" })
      }

      let token = generateToken(user.toJSON())

      let result = await transport.sendMail({
        from: "Coder test",
        to: user.email,
        subject: "Cambio de contraseña",
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
                                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Has solicitado el cambio de contraseña, ingrese al siguiente link para finalizar.</p>
                                        <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://localhost:${Config.PORT}/newPassword/${user.email}/${token}" style="color:#ee4c50;text-decoration:underline;">Cambiar contraseña!</a></p>
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
    catch (error) {
      console.log(error);
      res.status(500).send(error)
    }
  }

  newPassword = async (req, res) => {
    const { email, newPassword } = req.body

    try {
      const user = await UserModel.findOne({ email })

      if (!user) {
        req.logger.error(`Error al cambiar la contraseña : El email ${email} no se ha encontrado!`)
        return res.status(401).json({ error: "Email incorrecto!" })

      }

      if (isValidPassword(newPassword, user)) {
        req.logger.error(`Error al cambiar la contraseña : Contraseña en uso!`)
        return res.status(401).json({ error: "Contraseña en uso!" })
      }

      user.password = createHash(newPassword)

      await user.save()

      req.logger.info(`Se ha cambiado la contraseña del usuario ${email} - DATE:${new Date().toLocaleTimeString()}`)

      return res.json({ message: "Se ha cambiado la contraseña" })

    }
    catch (error) {
      res.status(500).send(error)
    }
  }

  logout = async (req, res) => {
    const email = req.user.email
    await UserModel.findOneAndUpdate({ email }, { last_connection: Date.now() });
    req.logger.info(`El usuario ${req.user.email} ha cerrado sesion - DATE:${new Date().toLocaleTimeString()}`)
    return res.send({ status: "success" })

  }

  current = async (req, res) => {
    const user = new userDTO(req.user)
    const userdb = await UserModel.findOne({ email: user.email })

    return res.status(200).json({ payload: userdb })
  }


}
