export default class CartReposity {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async (req, res) => {
        return await this.dao.getCarts(req, res)
    }
    getCartById = async (req, res) => {
        const { cid } = req.params
        return await this.dao.getCartById(cid, req, res)
    }
    addCart = async (req, res) => {
        const token = req.cookies["coderCookieToken"];
        return await this.dao.addCart(token, req, res)
    }
    addProductToCart = async (req, res) => {
        const token = req.cookies["coderCookieToken"];
        const { cid, pid } = req.params
        return await this.dao.addProductToCart(token, cid, pid, req, res)
    }
    deleteCart = async (req, res) => {
        const { cid } = req.params
        return await this.dao.deleteCart(cid, req, res)
    }
    deleteAllProductsFromCart = async (req, res) => {
        const { cid } = req.params
        return await this.dao.deleteAllProductsFromCart(cid, req, res)
    }
    deleteProductsFromCart = async (req, res) => {
        const { cid, pid } = req.params
        return await this.dao.deleteProductsFromCart(cid, pid, req, res)
    }
    updateQuantity = async (req, res) => {
        const { cid, pid } = req.params
        const { quantity } = req.body
        return await this.dao.updateQuantity(cid, pid, quantity, req, res)
    }
    getCartByIdView = async (req, res) => {
        const { cid } = req.params
        return await this.dao.getCartByIdView(cid, req, res)
    }
    getUserCart = async (req, res) => {
        const token = req.cookies["coderCookieToken"];
        return await this.dao.getUserCart(token, req, res)
    }
} 