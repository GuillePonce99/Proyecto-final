import ProductDTO from "../dao/DTOs/product.dto.js";
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async (req, res) => {
        let { limit = 10, page = 1, query } = req.query
        return await this.dao.getProducts(limit, page, query, req, res)

    }
    getProductById = async (req, res) => {
        const { pid } = req.params
        return await this.dao.getProductById(pid, req, res)
    }
    addProduct = async (req, res) => {
        let product = new ProductDTO(req.body)
        return await this.dao.addProduct(product, req, res)
    }
    deleteProduct = async (req, res) => {
        const { pid } = req.params
        return await this.dao.deleteProduct(pid, req, res)
    }
    updateProduct = async (req, res) => {
        const { pid } = req.params
        return await this.dao.updateProduct(pid, req, res)
    }
    getProductsView = async (req, res) => {
        let { limit = 10, page = 1, sort, query } = req.query
        return await this.dao.getProductsView(limit, page, sort, query, req, res)
    }
}