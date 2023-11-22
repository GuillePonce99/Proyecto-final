import Routes from "./router.js"
import { getProducts, getProductById, addProduct, deleteProduct, updateProduct } from "../controllers/product.controller.js"

export default class ProductsRouter extends Routes {
    init() {
        this.get("/", ["ADMIN", "USER", "USER_PREMIUM"], getProducts)

        this.get("/:pid", ["ADMIN", "USER", "USER_PREMIUM"], getProductById)

        this.post("/", ["ADMIN", "USER_PREMIUM"], addProduct)

        this.delete("/:pid", ["ADMIN", "USER_PREMIUM"], deleteProduct)

        this.put("/:pid", ["ADMIN", "USER_PREMIUM"], updateProduct)

    }
}

