


export const validation = (schema) => {
    return async (req, res, next) => {
        const requestObj = { ...req.query, ...req.params, ...req.body };
        const result = schema.validate(requestObj, { abortEarly: false });
        if (result?.error) {
            return res.status(400).json({ msg: "validation error", errors: result.error.details });
        }
        return next();
    }
}

