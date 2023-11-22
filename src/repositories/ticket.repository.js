export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getTickets = async (req, res) => {
        const token = req.cookies["coderCookieToken"];
        return await this.dao.getTickets(token, res)

    }
    getTicketById = async (req, res) => {
        const { tid } = req.params
        return await this.dao.getTicketById(tid, res)
    }

    createTicket = async (req, res) => {
        const { cid } = req.params
        const { code } = req.body
        const token = req.cookies["coderCookieToken"];

        return await this.dao.createTicket(code, token, cid, res)
    }

    sendTicket = async (req, res) => {
        const { tid } = req.params
        const user = req.user
        return await this.dao.sendTicket(tid, user, res)
    }
}
