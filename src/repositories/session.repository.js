export default class SessionRepository {
    constructor(dao) {
        this.dao = dao
    }
    login = async (req, res) => {
        return await this.dao.login(req, res)
    }

    loginGitHub = async (req, res) => {
        return await this.dao.loginGitHub(req, res)
    }

    signup = async (req, res) => {
        return await this.dao.signup(req, res)
    }

    forgot = async (req, res) => {
        return await this.dao.forgot(req, res)
    }

    newPassword = async (req, res) => {
        return await this.dao.newPassword(req, res)
    }

    logout = async (req, res) => {
        return await this.dao.logout(req, res)
    }

    current = async (req, res) => {
        return await this.dao.current(req, res)
    }

}