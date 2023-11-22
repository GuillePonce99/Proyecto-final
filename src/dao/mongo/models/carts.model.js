import mongoose from "mongoose";

const Schema = mongoose.Schema;
const collection = "carts"

const cartsSchema = new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]
    }
});

cartsSchema.pre("findOne", function () {
    this.populate('products.product')
})
cartsSchema.pre("findById", function () {
    this.populate('products.product')
})


const CartsModel = mongoose.model(collection, cartsSchema)
export default CartsModel
