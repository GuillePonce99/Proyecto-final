import { ticketServices } from "../repositories/index.js"

export const getTicketById = async (req, res) => {
    return await ticketServices.getTicketById(req, res)
}

export const getTickets = async (req, res) => {
    return await ticketServices.getTickets(req, res)
}

export const sendTicket = async (req, res) => {
    return await ticketServices.sendTicket(req, res)
}