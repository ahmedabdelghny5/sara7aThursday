import joi from "joi"
import { generalRules } from "../../utils/generalRules/index.js"



export const sendMessageSchema = joi.object({
    content: joi.string().min(1).required(),
    userId: generalRules.id.required(),
})