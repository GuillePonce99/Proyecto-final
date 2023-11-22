import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const Schema = mongoose.Schema;
const collection = "products"

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String,
        default: "admin"
    }
});

productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model(collection, productSchema)

export default ProductModel