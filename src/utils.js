import fs from "fs"
import { dirname } from "path"
import { fileURLToPath } from "url"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport"

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

const read = async (file) => {
  try {
    let result = await fs.promises.readFile(__dirname + "/" + file, "utf-8")
    let data = await JSON.parse(result)
    return data
  }
  catch (error) {
    console.log(error);
  }
}

const write = async (file, data) => {

  try {
    await fs.promises.writeFile(__dirname + "/" + file, JSON.stringify(data))
    return true;
  }
  catch (error) {
    console.log(error);
  }
}

//HASHEO DE CONTRASEÑAS
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password)

//JWT
export const PRIVATE_KEY = "CoderKeyQueFuncionaComoUnSecret"

export const generateToken = (user) => {
  const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" })
  return token
}

/*
export const authToken = (req, res, next) => {
  const authHeader = req.header.authorization;
  if (!authHeader) {
    return res.status(401).send({ error: "No autenticado" })
  }
  const token = authHeader.(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) {
      return res.status(401).send({ error: "No autorizado" })
    }
    req.user = credentials.user;
    next()
  })
}
*/

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error)
      }
      if (!user) {
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
      }

      req.user = user

      next()
    })(req, res, next)
  }
}

/*
export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: "No autorizado" })
    }
    if (req.user.role != role) {
      return res.status(401).send({ error: "No tiene permisos" })
    }
    next()
  }
}
*/

export default { read, write };