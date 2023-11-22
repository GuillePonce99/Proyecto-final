import passport from "passport";
import local from "passport-local"
import jwt from "passport-jwt"
import GitHubStrategy from "passport-github2"
import UserModel from "../dao/mongo/models/users.model.js";
import { isValidPassword } from "../utils.js";
import Config from "./config.js";

const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
        return token
    } else {
        return token
    }
}

const initializePassport = () => {

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: Config.COOKIE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: Config.GITHUB_CLIENT_ID,
        clientSecret: Config.GITHUB_CLIENT_SECRET,
        callbackURL: Config.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email })
            const newName = profile._json.name.split(" ")
            const name = newName.splice(0, 1).toString()
            const lastName = newName.join(" ");
            if (!user) {
                let newUser = {
                    firstName: name,
                    lastName: lastName,
                    age: 18,
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser)

                return done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    /*
    passport.use("login", new LocalStrategy({
        usernameField: "email"
    },
        async (username, password, done) => {

            try {
                if (username === "adminCoder@coder.com" && password === "admin") {

                    const admin = {
                        _id: "admin",
                        email: username
                    }

                    return done(null, admin)
                } else {

                    const user = await UserModel.findOne({ email: username })

                    if (user === null) {

                        return done(null, false, { message: "User not found" })
                    } else if (!isValidPassword(password, user)) {
                        return done(null, false, { message: "Contraseña incorrecta!" })
                    } else {
                        return done(null, user)
                    }
                }

            } catch (error) {
                return done(error)
            }
        })
    );
        */
}
export default initializePassport