import { usersServices } from "../repositories/index.js"

export const getUsers = async (req, res) => {
    const result = await usersServices.getUsers(req, res)
    res.status(200).json({ message: "success", result })
}
export const deleteInactiveUser = async (req, res) => {
    return await usersServices.deleteInactiveUser(req, res)
}

export const changeRole = async (req, res) => {
    return await usersServices.changeRole(req, res)
}

export const deleteUser = async (req, res) => {
    return await usersServices.deleteUser(req, res)
}


