import { login, loginGitHub, signup, forgot, logout, current, newPassword } from "../controllers/sessions.controller.js";
import { passportCall } from "../utils.js";
import Routes from "./router.js";

export default class SessionRouter extends Routes {
    init() {
        //Rutas de inicio de sesion, y registro
        this.post("/login", ["PUBLIC"], login);

        this.post("/signup", ["PUBLIC"], signup);

        //Ruta para solicitar cambio de contraseña
        this.put("/forgot", ["PUBLIC"], forgot)

        //Ruta para cambiar la contraseña
        this.put("/newPassword", ["PUBLIC"], newPassword)

        //Ruta para eliminar la sesion actual
        this.get("/logout", ["USER", "USER_PREMIUM", "ADMIN"], logout)

        //Ruta para obtener el token del request
        this.get("/current", ["USER", "USER_PREMIUM", "ADMIN"], passportCall("jwt"), current)

        //Rutas en caso de que exista un error en la autenticacion de passport
        this.get("/failureSignup", ["PUBLIC"], (req, res) => { res.status(401).json({ error: "Email en uso o edad incorrecta!" }) })

        this.get("/failureLogin", ["PUBLIC"], (req, res) => { res.status(401).json({ error: "Credenciales Incorrectas!" }) })

        //Rutas de login con github
        this.get("/github", ["PUBLIC"], passportCall("github", { scope: ["user:email"] }), (req, res) => { res.status(200).send("success") })

        this.get("/githubCallback", ["PUBLIC"], passportCall("github", { failureRedirect: "/api/sessions/failureLogin" }), loginGitHub)
    }
}




