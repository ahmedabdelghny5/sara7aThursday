import { Router } from "express";
import * as US from "./user.service.js";
import * as UV from "./user.validation.js";
import { authentication, authorization, roles } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
const userRouter = Router()



userRouter.post("/signup", validation(UV.signUpSchema), US.signup)
userRouter.post("/signin", US.signin)
// userRouter.get("/confirmEmail/:token", US.confirmEmail)
userRouter.get("/profile", authentication, US.getProfile)
userRouter.patch("/profile/update", validation(UV.updateProfileSchema), authentication, US.updateProfile)
userRouter.patch("/update/password", validation(UV.updatePasswordSchema), authentication, US.updatePassword)
userRouter.delete("/freezeAccount", authentication, US.freezeAccount)
userRouter.get("/profile/:id", US.shareProfile)


export default userRouter