import mongoose from "mongoose";
const Schema = mongoose.Schema;
const collection = "tickets"

const ticketsSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    amount: Number,
    purchaser: {
        type: String
    }
})

ticketsSchema.set("timestamps", {
    createdAt: "purchase_datetime"
})

const TicketsModel = mongoose.model(collection, ticketsSchema)
export default TicketsModel