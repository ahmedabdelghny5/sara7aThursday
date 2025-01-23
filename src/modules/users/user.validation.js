import joi from "joi";
import { genderTypes } from "../../DB/models/user.model.js"
import { generalRules } from './../../utils/generalRules/index.js';



export const signUpSchema = joi.object({
    name: joi.string().alphanum().min(3).max(20).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
    gender: joi.string().valid(genderTypes.female, genderTypes.male).required(),
    phone: joi.string().required(),
})


export const updateProfileSchema = joi.object({
    name: joi.string().alphanum().min(3).max(20),
    gender: joi.string().valid(genderTypes.female, genderTypes.male),
    phone: joi.string(),
})


export const updatePasswordSchema = joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
})








