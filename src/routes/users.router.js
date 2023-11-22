import Routes from "./router.js"
import { getUsers, deleteInactiveUser, changeRole, deleteUser } from "../controllers/users.controller.js"

export default class UsersRouter extends Routes {
    init() {
        this.get("/", ["ADMIN", "USER", "USER_PREMIUM"], getUsers)

        this.delete("/", ["PUBLIC"], deleteInactiveUser)

        //Ruta para cambiar rol de usuario
        this.get("/premium/:email/:newRole", ["ADMIN"], changeRole)

        //Ruta para eliminar un usuario
        this.delete("/deleteUser/:email", ["ADMIN"], deleteUser)
    }
}

