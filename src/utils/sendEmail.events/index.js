
import { EventEmitter } from "events"
import { generateToken } from "../token/index.js"
import { sendEmail } from './../../service/sendEmails.js';

export const eventEmitter = new EventEmitter()



// eventEmitter.on("sendEmailConfirmation", async (data) => {
//     const { email } = data
//     const token = await generateToken({
//         payload: { email },
//         SIGNATURE: process.env.SIGNATURE_TOKEN_CONFIRM,
//         option: { expiresIn: "3m" }
//     })
//     const link = `http://localhost:3000/users/confirmEmail/${token}`
//     await sendEmail(email, "confirmEmail", `<a href=${link}>confirm email</a>`)

// })
