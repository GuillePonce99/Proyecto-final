import Routes from "./router.js"
import mercadopago from "mercadopago"
import CartsModel from "../dao/mongo/models/carts.model.js"
import Config from "../config/config.js"

export default class PaymentsRouter extends Routes {
    init() {

        this.post("/mercadopago-payment", ["ADMIN", "USER", "USER_PREMIUM"], async (req, res) => {
            try {
                mercadopago.configure({ access_token: Config.MP_ACCESS_TOKEN })
                const { cid } = req.body

                const cart = await CartsModel.findById(cid)

                let items = []
                cart.products.map((product) => {
                    let productItem = {
                        title: product.product.title,
                        description: product.product.description,
                        unit_price: product.product.price,
                        currency_id: "ARS",
                        quantity: product.quantity,
                    }
                    items.push(productItem)
                })

                const result = await mercadopago.preferences.create({
                    items,
                    back_urls: {
                        success: "http://localhost:3000/success"
                    },
                });

                res.send({ status: "success", payload: result.body })
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error)
            }
        })

    }
}

