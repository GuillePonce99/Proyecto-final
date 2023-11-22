import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const requester = supertest("http://localhost:8080/")

describe("Testing API (PRODUCTS,CARTS,SESSIONS)", () => {

    //TEST DEL MODULO DE PRODUCTOS
    describe("Test de productos", () => {
        let cookie
        let productCode
        const admin = {
            email: "admin@coder.com",
            password: "admin"
        }

        //before para iniciar sesion y asi generar un token que autorize a los demas test
        before("El endpoint POST /api/sessions/login debe de iniciar sesion como ADMIN para continuar con los siguientes tests", async () => {
            const result = await requester.post("api/sessions/login").send(admin)
            const cookieResult = await result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.ok.and.eql("coderCookieToken")
            expect(cookie.value).to.be.ok
        })

        it("El endpoint POST /api/products debe CREAR un producto", async () => {
            const productMock = {
                title: "BANANA",
                description: "FRUTA",
                code: "123",
                price: 25,
                stock: 50,
                category: "FRUTAS"
            }
            productCode = productMock.code
            const {
                statusCode,
                ok,
                _body
            } = await requester.post("api/products").send(productMock).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.result).to.be.ok.and.have.property("_id")
        }).timeout(5000)

        it("El endpoint GET /api/products/:pid debe OBTENER un producto por su CODE", async () => {
            const { statusCode, ok, _body } = await requester.get(`api/products/${productCode}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.result.code).to.be.ok.and.be.eql(productCode)

        })
        it("El endpoint PUT /api/products/:pid debe ACTUALIZAR un producto por su CODE", async () => {
            const updateProduct = {
                title: "TOMATE",
                description: "VERDURA",
            }
            const { statusCode, ok, _body } = await requester.put(`api/products/${productCode}`).send(updateProduct).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.result.title).to.be.ok.and.be.eql(updateProduct.title)
            expect(_body.result.description).to.be.ok.and.be.eql(updateProduct.description)
        })
        it("El endpoint DELETE /api/products/:pid debe ELIMINAR un producto por su CODE", async () => {
            const { statusCode, ok, _body } = await requester.delete(`api/products/${productCode}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.result.code).to.be.ok.and.be.eql(productCode)
        })

    })

    //TEST DEL MODULO DE CARTS
    describe("Test de carts", () => {
        let cookie
        let cartId
        let productId = "64dd779acfd3bcf287cc40d1"
        const userTest = {
            email: "guille@gmail.com",
            password: "123"
        }
        //before para iniciar sesion y asi generear un token que autorize a los demas test
        before("El endpoint POST /api/sessions/login debe de iniciar sesion como USER para continuar con los siguientes tests", async () => {
            const result = await requester.post("api/sessions/login").send(userTest)
            const cookieResult = await result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.ok.and.eql("coderCookieToken")
            expect(cookie.value).to.be.ok
        })

        it("El endpoint POST /api/carts debe CREAR un carrito", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post("api/carts").set("Cookie", [`${cookie.name}=${cookie.value}`])
            cartId = _body.id
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.cart).to.be.ok.and.have.property("_id")
            expect(_body.user.email).to.be.ok.and.be.eql(userTest.email)
        })


        it("El endpoint POST /api/carts/:cid/products/:pid debe AGREGAR un producto (pid) a un carrito (cid)", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.post(`api/carts/${cartId}/products/${productId}`).set("Cookie", [`${cookie.name}=${cookie.value}`])

            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.data._id).to.be.ok.and.eql(cartId)
            expect(_body.data.products).to.have.lengthOf.at.least(1)
        })

        it("El endpoint DELETE /api/carts/:cid/products/:pid debe ELIMINAR un producto (pid) de un carrito (cid)", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.delete(`api/carts/${cartId}/products/${productId}`).set("Cookie", [`${cookie.name}=${cookie.value}`])

            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.data._id).to.be.ok.and.eql(cartId)
            expect(_body.data.products).to.have.lengthOf.at.empty
        })

        it("El endpoint DELETE /api/carts/:cid debe ELIMINAR un carrito por su id", async () => {
            const {
                statusCode,
                ok,
                _body
            } = await requester.delete(`api/carts/${cartId}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            cartId = _body.id
            expect(statusCode).to.be.eql(200)
            expect(ok).to.be.true
            expect(_body.status).to.be.ok.and.be.eql("success")
        })

    })

    //TEST DEL MODULO DE SESSIONS
    describe("Test de sessions", () => {
        let cookie
        let uid
        it("El endpoint POST /api/sessions/signup debe CREAR un usuario nuevo", async () => {
            const mockUser = {
                firstName: "user",
                lastName: "test",
                age: 30,
                email: "userTest@gmail.com",
                password: "test"
            }
            const { _body } = await requester.post("api/sessions/signup").send(mockUser)
            uid = _body.result._id
            expect(_body.result).to.be.ok
        })

        it("El endpoint POST /api/sessions/login debe de iniciar sesion", async () => {
            const mockUser = {
                email: "userTest@gmail.com",
                password: "test"
            }
            const result = await requester.post("api/sessions/login").send(mockUser)
            const cookieResult = await result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(cookie.name).to.be.ok.and.eql("coderCookieToken")
            expect(cookie.value).to.be.ok
        })

        it("El endpoint GET /api/sessions/current debe de obtener el usuario que inicio sesion", async () => {
            const { _body } = await requester.get("api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(_body.payload.email).to.be.ok.and.eql("userTest@gmail.com")
        })

        it("El endpoint GET /api/sessions/premium/:uid debe de cambiar el rol del usuario que inicio sesion", async () => {
            const oldUser = await requester.get("api/sessions/current").set("Cookie", [`${cookie.name}=${cookie.value}`])
            const result = await requester.get(`api/sessions/premium/${uid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            const cookieResult = await result.headers["set-cookie"][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split("=")[0],
                value: cookieResult.split("=")[1]
            }
            expect(result._body.user.role).to.be.ok.and.to.not.be.eql(oldUser._body.payload.role)
        })

        it("El endpoint DELETE /api/sessions/deleteUser/:uid debe de eliminar el usuario que inicio sesion", async () => {
            const { _body } = await requester.delete(`api/sessions/deleteUser/${uid}`).set("Cookie", [`${cookie.name}=${cookie.value}`])
            expect(_body.message).to.be.ok.and.eql("success")
            expect(_body.id).to.be.eql(uid)
        })
    })
})