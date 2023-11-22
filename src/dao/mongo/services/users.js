import UserModel from "../models/users.model.js";
import { userDTO } from "../../DTOs/session.dto.js";

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
            console.log("hola");
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

        res.status(200).json({ message: "success" })
    }


    deleteUser = async (req, res) => {
        const { email } = req.params
        const user = await UserModel.findOne({ email })
        if (!user) {
            req.logger.error(`Error al eliminar un usuario : No se encuentra en la base de datos!`)
            return res.status(401).json({ message: "El usuario no existe!" })
        } else {
            await UserModel.findOneAndDelete({ email })
            req.logger.warning(`El usuario ${user.email} ha sido eliminado! - DATE:${new Date().toLocaleTimeString()}`)
            return res.status(200).json({ message: "success", user: user.email })
        }
    }


}
