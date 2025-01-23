
import { userModel } from "../../DB/models/index.js"
import { roles } from "../../middleware/auth.js"
import { asyncHandler, verifyToken, generateToken, eventEmitter, Hash, Compare, Encrypt, Decrypt } from "../../utils/index.js"



//-----------------------------------signup-------------------------------------------
export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, password, gender, phone } = req.body
    // check email
    const emailExist = await userModel.findOne({ email })
    if (emailExist) {
        return next(new Error("Email already exists", { cause: 409 }))
    }
    // hash password
    const hash = await Hash({ key: password, SALT_ROUNDS: process.env.SALT_ROUNDS })
    // encrypt phone
    var cipherText = await Encrypt({ key: phone, SECRET_KEY: process.env.SECRET_KEY })

    // eventEmitter.emit("sendEmailConfirmation", { email })

    // create
    const user = await userModel.create({ name, email, password: hash, gender, phone: cipherText })
    return res.status(201).json({ msg: "done", user })
})


// //----------------------------------confirmEmail--------------------------------------------
// export const confirmEmail = asyncHandler(async (req, res, next) => {
//     const { token } = req.body
//     const user = await userModel.findOne(
//         { email, confirmed: false }
//     )
//     if (!user) {
//         return next(new Error("User not found or already confirmed", { cause: 404 }))
//     }
//     if (!await Compare({ key: code, hashed: user.otp })) {
//         return next(new Error("Invalid code", { cause: 400 }))
//     }
//     await userModel.updateOne({ email }, { confirmed: true, $unset: { otp: 0 } })
//     return res.status(201).json({ msg: "done" })
// })

//----------------------------------signin----------------------------------------------
export const signin = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body
    // check email
    const user = await userModel.findOne({ email, confirmed: true })
    if (!user) {
        return res.status(400).json({ msg: "Email not exists or not confirmed yet" })
    }
    // check password
    const match = await Compare({ key: password, hashed: user.password })
    if (!match) {
        return res.status(400).json({ msg: "Invalid password" })
    }
    const token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE: user.role == roles.user ? process.env.SIGNATURE_TOKEN_USER : process.env.SIGNATURE_TOKEN_ADMIN,
        option: { expiresIn: "1d" }
    })

    return res.status(201).json({ msg: "done", token })
})

//----------------------------------updateProfile----------------------------------------------
export const updateProfile = asyncHandler(async (req, res, next) => {
    if (req.body?.phone) {
        req.body.phone = await Encrypt({ key: req.body.phone, SECRET_KEY: process.env.SECRET_KEY })
    }
    const user = await userModel.findByIdAndUpdate(req.user._id, req.body, { new: true })
    return res.status(201).json({ msg: "done", user })

})


//----------------------------------updatePassword----------------------------------------------
export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const match = await Compare({ key: oldPassword, hashed: req.user.password })
    if (!match) {
        return next(new Error("Invalid password", { cause: 400 }))
    }
    const hash = await Hash({ key: newPassword, SALT_ROUNDS: process.env.SALT_ROUNDS })
    const user = await userModel.findByIdAndUpdate(req.user._id,
        { password: hash, passwordChangedAt: Date.now() },
        { new: true }
    )
    return res.status(201).json({ msg: "done", user })

})

//----------------------------------freezeAccount(soft delete)----------------------------------------------
export const freezeAccount = asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(req.user._id, { isDeleted: true, passwordChangedAt: Date.now() }, { new: true })
    return res.status(201).json({ msg: "done" })

})

//----------------------------------getProfile----------------------------------------------
export const getProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById({ _id: req.user._id })

    return res.status(201).json({ msg: "done", user, })
})

//----------------------------------shareProfile----------------------------------------------
export const shareProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id).select("name email phone")
    user ? res.status(201).json({ msg: "done", user }) : next(new Error("User not found", { cause: 404 }))
})

