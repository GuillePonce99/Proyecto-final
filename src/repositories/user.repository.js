
export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    getUsers = async (req, res) => {
        return await this.dao.getUsers(req, res)
    }
    deleteInactiveUser = async (req, res) => {
        return await this.dao.deleteInactiveUser(req, res)
    }

    changeRole = async (req, res) => {
        return await this.dao.changeRole(req, res)
    }

    deleteUser = async (req, res) => {
        return await this.dao.deleteUser(req, res)
    }

}