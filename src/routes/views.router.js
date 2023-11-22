import { viewsController } from "../controllers/views.controller.js";
import { passportCall } from "../utils.js";
import Routes from "./router.js"

export default class ViewsRouter extends Routes {
    init() {
        this.get("/home", ["PUBLIC"], viewsController.home)
        this.get("/chat", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), viewsController.chat)
        this.get("/products", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), viewsController.products)
        this.get("/carts/:cid", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), viewsController.carts)
        this.get("/", ["PUBLIC"], viewsController.login)
        this.get("/forgot", ["PUBLIC"], viewsController.forgot)
        this.get("/newPassword/:user/:token", ["PUBLIC"], viewsController.newPassword)
        this.get("/signup", ["PUBLIC"], viewsController.signup)
        this.get("/tickets", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), viewsController.tickets)
        this.get("/usersManager", ["ADMIN"], passportCall("jwt"), viewsController.usersManager)
    }
}
