import mongoose from "mongoose";

const Schema = mongoose.Schema
const collection = "users"

const userSchema = new Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },
    role: {
        type: String,
        default: "user"
    }
}, {
    timestamps: true
})

userSchema.pre("findOne", function () {
    this.populate('cart')
})
userSchema.pre("findById", function () {
    this.populate('cart')
})

const UserModel = mongoose.model(collection, userSchema)
export default UserModel