import { cartsServices } from "../repositories/index.js"
import { ticketServices } from "../repositories/index.js"

export const getCarts = async (req, res) => {
    return await cartsServices.getCarts(req, res)
}
export const getCartById = async (req, res) => {
    return await cartsServices.getCartById(req, res)
}
export const addCart = async (req, res) => {
    return await cartsServices.addCart(req, res)
}
export const addProductToCart = async (req, res) => {
    return await cartsServices.addProductToCart(req, res)
}
export const deleteCart = async (req, res) => {
    return await cartsServices.deleteCart(req, res)
}
export const deleteAllProductsFromCart = async (req, res) => {
    return await cartsServices.deleteAllProductsFromCart(req, res)
}
export const deleteProductsFromCart = async (req, res) => {
    return await cartsServices.deleteProductsFromCart(req, res)
}
export const updateQuantity = async (req, res) => {
    return await cartsServices.updateQuantity(req, res)
}
export const getCartByIdView = async (req, res) => {
    return await cartsServices.getCartByIdView(req, res)
}
export const getUserCart = async (req, res) => {
    return await cartsServices.getUserCart(req, res)
}
export const purchase = async (req, res) => {
    return await ticketServices.createTicket(req, res)
}





