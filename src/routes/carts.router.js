import Routes from "./router.js"
import { getCarts, getCartById, getUserCart, addCart, addProductToCart, deleteAllProductsFromCart, deleteProductsFromCart, deleteCart, updateQuantity, purchase } from "../controllers/carts.controller.js"

export default class CartsRouter extends Routes {
    init() {
        this.get("/", ["USER", "USER_PREMIUM", "ADMIN"], getCarts)

        this.get("/:cid", ["PUBLIC"], getCartById)

        this.post("/", ["USER", "USER_PREMIUM", "ADMIN"], addCart)

        this.post("/:cid/products/:pid", ["USER", "USER_PREMIUM", "ADMIN"], addProductToCart)

        this.delete("/:cid", ["USER", "USER_PREMIUM", "ADMIN"], deleteCart)

        this.delete("/:cid/products", ["USER", "USER_PREMIUM", "ADMIN"], deleteAllProductsFromCart)

        this.delete("/:cid/products/:pid", ["USER", "USER_PREMIUM", "ADMIN"], deleteProductsFromCart)

        this.put("/:cid/products/:pid", ["USER", "USER_PREMIUM", "ADMIN"], updateQuantity)

        this.get("/user/cart", ["USER", "USER_PREMIUM", "ADMIN"], getUserCart)

        this.post("/:cid/purchase", ["USER", "USER_PREMIUM", "ADMIN"], purchase)
    }
}
