import { sessionsServices } from "../repositories/index.js"

export const login = async (req, res) => {
    return await sessionsServices.login(req, res)
}
export const loginGitHub = async (req, res) => {
    return await sessionsServices.loginGitHub(req, res)
}
export const signup = async (req, res) => {
    return await sessionsServices.signup(req, res)
}
export const forgot = async (req, res) => {
    return await sessionsServices.forgot(req, res)
}
export const newPassword = async (req, res) => {
    return await sessionsServices.newPassword(req, res)
}
export const logout = async (req, res) => {
    return await sessionsServices.logout(req, res)
}

export const current = async (req, res) => {
    return await sessionsServices.current(req, res)
}

