import Routes from "./router.js"
import { getTicketById, getTickets, sendTicket } from "../controllers/tickets.controller.js"

export default class TicketsRouter extends Routes {
    init() {
        this.get("/ticket/:tid", ["USER", "USER_PREMIUM", "ADMIN"], getTicketById)

        this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], getTickets)

        this.get("/sendTicket/:tid", ["USER", "USER_PREMIUM", "ADMIN"], sendTicket)
    }
}