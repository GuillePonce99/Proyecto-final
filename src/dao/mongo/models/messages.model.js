import mongoose from "mongoose";
const Schema = mongoose.Schema;
const collection = "messages"

const messagesSchema = new Schema({
    user: {
        type: String,
        trim: true
    },
    nick: {
        type: String,
        trim: true
    },
    message: String
}, { timestamps: true })

const MessagesModel = mongoose.model(collection, messagesSchema)
export default MessagesModel
