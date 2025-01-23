import { messageModel, userModel } from "../../DB/models/index.js"
import { asyncHandler } from "../../utils/globalErrorHandling/index.js"


//----------------------------------sendMessage----------------------------------------------
export const sendMessage = asyncHandler(async (req, res, next) => {
    const { content, userId } = req.body
    const user = await userModel.findById(userId)
    if (!user) {
        return next(new Error("User not found", { cause: 404 }))
    }
    const message = await messageModel.create({ content, userId })
    return res.status(201).json({ msg: "done", message })
})

//----------------------------------getMessages----------------------------------------------
export const getMessages = asyncHandler(async (req, res, next) => {

    const messages = await messageModel.find({ userId: req.user._id });
    return res.status(201).json({ msg: "done", messages })
})
