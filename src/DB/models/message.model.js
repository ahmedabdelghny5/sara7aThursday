import mongoose from "mongoose"


const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
})

export const messageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema)

